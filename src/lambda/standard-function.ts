import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { applyStandardTags, resourceName } from "../common/tagging";
import { BlueprintBaseProps, VpcProps, Environment } from "../common/types";
import { VpcDiscovery } from "../common/vpc-discovery";

/**
 * Memory configuration by environment.
 */
const MEMORY_DEFAULTS: Record<Environment, number> = {
  dev: 256,
  staging: 512,
  prod: 1024,
};

/**
 * Timeout configuration by environment (in seconds).
 */
const TIMEOUT_DEFAULTS: Record<Environment, number> = {
  dev: 30,
  staging: 60,
  prod: 120,
};

export interface StandardFunctionProps extends BlueprintBaseProps, VpcProps {
  /**
   * Path to the Lambda code directory or file.
   */
  readonly codePath: string;

  /**
   * Lambda handler. Default: index.handler
   */
  readonly handler?: string;

  /**
   * Lambda runtime. Default: NODEJS_20_X
   */
  readonly runtime?: lambda.Runtime;

  /**
   * Memory in MB. Defaults based on environment.
   */
  readonly memorySize?: number;

  /**
   * Timeout in seconds. Defaults based on environment.
   */
  readonly timeout?: number;

  /**
   * Additional environment variables for the Lambda function.
   */
  readonly environmentVariables?: Record<string, string>;

  /**
   * Whether to deploy in VPC. Default: false
   */
  readonly deployInVpc?: boolean;

  /**
   * Reserved concurrent executions. Default: no reservation
   */
  readonly reservedConcurrency?: number;

  /**
   * Enable X-Ray tracing. Default: true for staging/prod
   */
  readonly enableTracing?: boolean;

  /**
   * Enable Powertools Lambda layer. Default: true
   */
  readonly enablePowertools?: boolean;

  /**
   * Additional IAM policies to attach to the function role.
   */
  readonly additionalPolicies?: iam.PolicyStatement[];

  /**
   * Log retention in days.
   */
  readonly logRetentionDays?: logs.RetentionDays;

  /**
   * Architecture. Default: ARM_64 (cost-effective)
   */
  readonly architecture?: lambda.Architecture;
}

/**
 * Opinionated Lambda function with organizational best practices:
 *
 * - Environment-based memory/timeout defaults
 * - X-Ray tracing enabled for staging/prod
 * - Structured logging via Powertools
 * - ARM64 architecture for cost savings
 * - Standard tagging
 * - Optional VPC deployment with auto-discovery
 *
 * @example
 * new StandardFunction(this, 'Processor', {
 *   serviceName: 'order-processor',
 *   environment: 'prod',
 *   codePath: 'lambda/order-processor',
 * });
 */
export class StandardFunction extends Construct {
  /** The Lambda function */
  readonly function: lambda.Function;

  /** The CloudWatch log group */
  readonly logGroup: logs.LogGroup;

  /** The function ARN */
  readonly functionArn: string;

  /** The function name */
  readonly functionName: string;

  constructor(scope: Construct, id: string, props: StandardFunctionProps) {
    super(scope, id);

    const functionName = resourceName(props.serviceName, props.environment);

    // Create log group first for custom retention
    const defaultLogRetention: Record<Environment, logs.RetentionDays> = {
      dev: logs.RetentionDays.TWO_WEEKS,
      staging: logs.RetentionDays.ONE_MONTH,
      prod: logs.RetentionDays.THREE_MONTHS,
    };

    this.logGroup = new logs.LogGroup(this, "LogGroup", {
      logGroupName: `/aws/lambda/${functionName}`,
      retention:
        props.logRetentionDays ?? defaultLogRetention[props.environment],
      removalPolicy:
        props.environment === "prod"
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
    });

    // VPC configuration
    let vpcConfig:
      | { vpc: ec2.IVpc; vpcSubnets: ec2.SubnetSelection }
      | undefined;
    if (props.deployInVpc) {
      const vpc =
        props.vpc ??
        new VpcDiscovery(this, "VpcDiscovery", {
          vpcName: props.vpcName,
        }).vpc;

      vpcConfig = {
        vpc,
        vpcSubnets: props.vpcSubnets ?? {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      };
    }

    // Build environment variables
    const envVars: Record<string, string> = {
      SERVICE_NAME: props.serviceName,
      ENVIRONMENT: props.environment,
      LOG_LEVEL: props.environment === "prod" ? "INFO" : "DEBUG",
      POWERTOOLS_SERVICE_NAME: props.serviceName,
      POWERTOOLS_METRICS_NAMESPACE: props.serviceName,
      ...props.environmentVariables,
    };

    // Determine tracing
    const enableTracing = props.enableTracing ?? props.environment !== "dev";

    // Build layers
    const layers: lambda.ILayerVersion[] = [];

    // Add Powertools layer if enabled (using AWS-provided layer)
    if (props.enablePowertools !== false) {
      // This ARN is for us-east-1, adjust for your region
      // See: https://docs.powertools.aws.dev/lambda/typescript/latest/#lambda-layer
      const powertoolsLayerArn = `arn:aws:lambda:${cdk.Stack.of(this).region}:094274105915:layer:AWSLambdaPowertoolsTypeScriptV2:1`;
      try {
        layers.push(
          lambda.LayerVersion.fromLayerVersionArn(
            this,
            "PowertoolsLayer",
            powertoolsLayerArn,
          ),
        );
      } catch {
        // Layer may not exist in all regions, continue without it
      }
    }

    // Create the function
    this.function = new lambda.Function(this, "Function", {
      functionName,
      description: `${props.serviceName} - ${props.environment}`,

      // Code configuration
      code: lambda.Code.fromAsset(props.codePath),
      handler: props.handler ?? "index.handler",
      runtime: props.runtime ?? lambda.Runtime.NODEJS_20_X,
      architecture: props.architecture ?? lambda.Architecture.ARM_64,

      // Resource configuration
      memorySize: props.memorySize ?? MEMORY_DEFAULTS[props.environment],
      timeout: cdk.Duration.seconds(
        props.timeout ?? TIMEOUT_DEFAULTS[props.environment],
      ),
      reservedConcurrentExecutions: props.reservedConcurrency,

      // Environment
      environment: envVars,
      layers,

      // VPC (optional)
      ...vpcConfig,

      // Observability
      tracing: enableTracing ? lambda.Tracing.ACTIVE : lambda.Tracing.DISABLED,
      logGroup: this.logGroup,

      // Best practices
      retryAttempts: 2,
    });

    // Add additional policies
    if (props.additionalPolicies) {
      props.additionalPolicies.forEach((policy) => {
        this.function.addToRolePolicy(policy);
      });
    }

    this.functionArn = this.function.functionArn;
    this.functionName = this.function.functionName;

    // Apply standard tags
    applyStandardTags(this, props);

    // Outputs
    new cdk.CfnOutput(this, "FunctionArn", {
      value: this.functionArn,
      description: `ARN for ${props.serviceName}`,
    });
  }

  /**
   * Grant invoke permissions to another principal.
   */
  grantInvoke(grantee: iam.IGrantable): iam.Grant {
    return this.function.grantInvoke(grantee);
  }

  /**
   * Add an event source to the function.
   */
  addEventSource(source: lambda.IEventSource): void {
    this.function.addEventSource(source);
  }
}
