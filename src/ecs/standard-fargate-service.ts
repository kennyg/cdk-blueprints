import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { applyStandardTags, resourceName } from "../common/tagging";
import {
  BlueprintBaseProps,
  VpcProps,
  SCALING_DEFAULTS,
} from "../common/types";
import { VpcDiscovery } from "../common/vpc-discovery";

export interface StandardFargateServiceProps
  extends BlueprintBaseProps, VpcProps {
  /**
   * Container image URI (ECR or public registry).
   */
  readonly image: string;

  /**
   * Container port. Default: 8080
   */
  readonly containerPort?: number;

  /**
   * CPU units. Default: 256 (0.25 vCPU)
   */
  readonly cpu?: number;

  /**
   * Memory in MiB. Default: 512
   */
  readonly memoryMiB?: number;

  /**
   * Environment variables for the container.
   */
  readonly containerEnv?: Record<string, string>;

  /**
   * Minimum number of tasks. Overrides environment default.
   */
  readonly minCapacity?: number;

  /**
   * Maximum number of tasks. Overrides environment default.
   */
  readonly maxCapacity?: number;

  /**
   * Target CPU utilization percentage for scaling. Overrides environment default.
   */
  readonly targetCpuUtilization?: number;

  /**
   * Target memory utilization percentage for scaling.
   */
  readonly targetMemoryUtilization?: number;

  /**
   * Health check path. Default: /health
   */
  readonly healthCheckPath?: string;

  /**
   * Existing ECS cluster to use. If not provided, creates a new one.
   */
  readonly cluster?: ecs.ICluster;

  /**
   * Make the ALB internet-facing. Default: false (internal)
   */
  readonly publicLoadBalancer?: boolean;

  /**
   * Enable ECS Exec for debugging. Default: true in dev, false otherwise
   */
  readonly enableExecuteCommand?: boolean;

  /**
   * Log retention in days. Default: 30 (dev), 90 (staging), 365 (prod)
   */
  readonly logRetentionDays?: number;
}

/**
 * Opinionated Fargate service with organizational best practices:
 *
 * - Auto-discovers VPC (excludes default)
 * - Private subnets by default
 * - Circuit breaker with rollback
 * - Environment-based auto-scaling
 * - Centralized logging with retention policies
 * - Standard tagging
 * - Health checks configured
 *
 * @example
 * new StandardFargateService(this, 'Api', {
 *   serviceName: 'order-api',
 *   environment: 'prod',
 *   image: '123456789.dkr.ecr.us-east-1.amazonaws.com/order-api:latest',
 * });
 */
export class StandardFargateService extends Construct {
  /** The underlying ECS service */
  readonly service: ecsPatterns.ApplicationLoadBalancedFargateService;

  /** The ECS cluster */
  readonly cluster: ecs.ICluster;

  /** The VPC */
  readonly vpc: ec2.IVpc;

  /** The ALB DNS name */
  readonly loadBalancerDnsName: string;

  /** CloudWatch log group for container logs */
  readonly logGroup: logs.ILogGroup;

  constructor(
    scope: Construct,
    id: string,
    props: StandardFargateServiceProps,
  ) {
    super(scope, id);

    // Resolve VPC
    if (props.vpc) {
      this.vpc = props.vpc;
    } else {
      const vpcDiscovery = new VpcDiscovery(this, "VpcDiscovery", {
        vpcName: props.vpcName,
      });
      this.vpc = vpcDiscovery.vpc;
    }

    // Resolve or create cluster
    this.cluster =
      props.cluster ??
      new ecs.Cluster(this, "Cluster", {
        vpc: this.vpc,
        clusterName: resourceName(
          props.serviceName,
          props.environment,
          "cluster",
        ),
        containerInsights: props.environment === "prod",
      });

    // Log retention based on environment
    const defaultLogRetention: Record<string, logs.RetentionDays> = {
      dev: logs.RetentionDays.ONE_MONTH,
      staging: logs.RetentionDays.THREE_MONTHS,
      prod: logs.RetentionDays.ONE_YEAR,
    };

    this.logGroup = new logs.LogGroup(this, "LogGroup", {
      logGroupName: `/ecs/${props.serviceName}/${props.environment}`,
      retention: props.logRetentionDays
        ? (props.logRetentionDays as logs.RetentionDays)
        : defaultLogRetention[props.environment],
      removalPolicy:
        props.environment === "prod"
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
    });

    // Build container environment
    const containerEnv: Record<string, string> = {
      SERVICE_NAME: props.serviceName,
      ENVIRONMENT: props.environment,
      AWS_REGION: cdk.Stack.of(this).region,
      ...props.containerEnv,
    };

    // Create the service
    this.service = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "Service",
      {
        cluster: this.cluster,
        serviceName: resourceName(props.serviceName, props.environment),

        // Task configuration
        cpu: props.cpu ?? 256,
        memoryLimitMiB: props.memoryMiB ?? 512,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(props.image),
          containerPort: props.containerPort ?? 8080,
          environment: containerEnv,
          logDriver: ecs.LogDrivers.awsLogs({
            logGroup: this.logGroup,
            streamPrefix: "ecs",
          }),
        },

        // Network configuration
        taskSubnets: props.vpcSubnets ?? {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        publicLoadBalancer: props.publicLoadBalancer ?? false,

        // Best practices
        circuitBreaker: { rollback: true },
        enableExecuteCommand:
          props.enableExecuteCommand ?? props.environment === "dev",
        propagateTags: ecs.PropagatedTagSource.SERVICE,

        // Health check
        healthCheck: {
          command: [
            "CMD-SHELL",
            `curl -f http://localhost:${props.containerPort ?? 8080}${props.healthCheckPath ?? "/health"} || exit 1`,
          ],
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
          retries: 3,
          startPeriod: cdk.Duration.seconds(60),
        },
      },
    );

    // Configure ALB health check
    this.service.targetGroup.configureHealthCheck({
      path: props.healthCheckPath ?? "/health",
      healthyHttpCodes: "200",
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
    });

    // Auto-scaling
    const envDefaults = SCALING_DEFAULTS[props.environment];
    const minCapacity = props.minCapacity ?? envDefaults.minCapacity;
    const maxCapacity = props.maxCapacity ?? envDefaults.maxCapacity;
    const targetCpuUtilization =
      props.targetCpuUtilization ?? envDefaults.targetCpuUtilization ?? 70;
    const targetMemoryUtilization =
      props.targetMemoryUtilization ?? envDefaults.targetMemoryUtilization;

    const scaling = this.service.service.autoScaleTaskCount({
      minCapacity,
      maxCapacity,
    });

    scaling.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: targetCpuUtilization,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    if (targetMemoryUtilization) {
      scaling.scaleOnMemoryUtilization("MemoryScaling", {
        targetUtilizationPercent: targetMemoryUtilization,
        scaleInCooldown: cdk.Duration.seconds(60),
        scaleOutCooldown: cdk.Duration.seconds(60),
      });
    }

    this.loadBalancerDnsName = this.service.loadBalancer.loadBalancerDnsName;

    // Apply standard tags
    applyStandardTags(this, props);

    // Outputs
    new cdk.CfnOutput(this, "ServiceUrl", {
      value: `http://${this.loadBalancerDnsName}`,
      description: `URL for ${props.serviceName}`,
    });
  }
}
