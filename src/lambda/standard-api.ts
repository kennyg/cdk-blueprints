import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { StandardFunction } from "./standard-function";
import { applyStandardTags, resourceName } from "../common/tagging";
import { BlueprintBaseProps } from "../common/types";

/**
 * Props for an individual endpoint's Lambda function.
 * This is a subset of StandardFunctionProps without the base props that are inherited from the API.
 */
export interface EndpointFunctionProps {
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
   * Existing VPC to use.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * VPC name to look up.
   */
  readonly vpcName?: string;

  /**
   * Subnet selection override.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

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

export interface ApiEndpoint {
  /**
   * HTTP method (GET, POST, PUT, DELETE, etc.)
   */
  readonly method: string;

  /**
   * Resource path (e.g., '/users', '/orders/{id}')
   */
  readonly path: string;

  /**
   * Lambda function props for this endpoint.
   */
  readonly functionProps: EndpointFunctionProps;
}

export interface StandardApiProps extends BlueprintBaseProps {
  /**
   * API description.
   */
  readonly description?: string;

  /**
   * API endpoints to create.
   */
  readonly endpoints: ApiEndpoint[];

  /**
   * Enable API key requirement. Default: false
   */
  readonly requireApiKey?: boolean;

  /**
   * Throttling rate limit (requests per second). Default: 1000
   */
  readonly rateLimit?: number;

  /**
   * Throttling burst limit. Default: 2000
   */
  readonly burstLimit?: number;

  /**
   * Enable CORS. Default: true
   */
  readonly enableCors?: boolean;

  /**
   * Allowed CORS origins. Default: ['*'] for dev, restricted for prod
   */
  readonly corsOrigins?: string[];

  /**
   * Deploy stage name. Default: matches environment
   */
  readonly stageName?: string;
}

/**
 * Opinionated REST API with Lambda backends:
 *
 * - Multiple endpoints with individual Lambda functions
 * - Throttling configured per environment
 * - CORS enabled by default
 * - Access logging
 * - Standard tagging
 *
 * @example
 * new StandardApi(this, 'OrdersApi', {
 *   serviceName: 'orders-api',
 *   environment: 'prod',
 *   endpoints: [
 *     {
 *       method: 'GET',
 *       path: '/orders',
 *       functionProps: { codePath: 'lambda/list-orders' },
 *     },
 *     {
 *       method: 'POST',
 *       path: '/orders',
 *       functionProps: { codePath: 'lambda/create-order' },
 *     },
 *   ],
 * });
 */
export class StandardApi extends Construct {
  /** The API Gateway REST API */
  readonly api: apigateway.RestApi;

  /** The API endpoint URL */
  readonly apiUrl: string;

  private readonly _functions: Record<string, lambda.Function> = {};

  constructor(scope: Construct, id: string, props: StandardApiProps) {
    super(scope, id);

    const apiName = resourceName(props.serviceName, props.environment, "api");

    // Access log group
    const accessLogGroup = new logs.LogGroup(this, "AccessLogs", {
      logGroupName: `/aws/apigateway/${apiName}/access-logs`,
      retention:
        props.environment === "prod"
          ? logs.RetentionDays.THREE_MONTHS
          : logs.RetentionDays.TWO_WEEKS,
      removalPolicy:
        props.environment === "prod"
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
    });

    // CORS configuration
    const corsOrigins =
      props.corsOrigins ??
      (props.environment === "prod"
        ? ["https://yourdomain.com"] // Override this!
        : ["*"]);

    const corsOptions: apigateway.CorsOptions | undefined =
      props.enableCors !== false
        ? {
            allowOrigins: corsOrigins,
            allowMethods: apigateway.Cors.ALL_METHODS,
            allowHeaders: ["Content-Type", "Authorization", "X-Api-Key"],
          }
        : undefined;

    // Create REST API
    this.api = new apigateway.RestApi(this, "Api", {
      restApiName: apiName,
      description:
        props.description ?? `${props.serviceName} API - ${props.environment}`,

      // Deployment
      deployOptions: {
        stageName: props.stageName ?? props.environment,
        throttlingRateLimit: props.rateLimit ?? 1000,
        throttlingBurstLimit: props.burstLimit ?? 2000,
        accessLogDestination: new apigateway.LogGroupLogDestination(
          accessLogGroup,
        ),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
        tracingEnabled: props.environment !== "dev",
        metricsEnabled: true,
      },

      // CORS
      defaultCorsPreflightOptions: corsOptions,

      // API key
      apiKeySourceType: props.requireApiKey
        ? apigateway.ApiKeySourceType.HEADER
        : undefined,
    });

    // Create resources and methods for each endpoint
    const resources: Record<string, apigateway.IResource> = {};

    for (const endpoint of props.endpoints) {
      // Get or create resource for path
      const resource = this.getOrCreateResource(endpoint.path, resources);

      // Create Lambda function for this endpoint
      const functionId = `${endpoint.method}${endpoint.path.replace(/[^a-zA-Z0-9]/g, "")}`;
      const fn = new StandardFunction(this, functionId, {
        ...endpoint.functionProps,
        serviceName: `${props.serviceName}-${endpoint.method.toLowerCase()}${endpoint.path.replace(/\//g, "-").replace(/[{}]/g, "")}`,
        environment: props.environment,
        team: props.team,
        costCenter: props.costCenter,
      });

      this._functions[`${endpoint.method} ${endpoint.path}`] = fn.function;

      // Add method to resource
      const integration = new apigateway.LambdaIntegration(fn.function, {
        proxy: true,
      });

      resource.addMethod(endpoint.method, integration, {
        apiKeyRequired: props.requireApiKey,
      });
    }

    this.apiUrl = this.api.url;

    // Apply standard tags
    applyStandardTags(this, props);

    // Outputs
    new cdk.CfnOutput(this, "ApiUrl", {
      value: this.apiUrl,
      description: `URL for ${props.serviceName}`,
    });
  }

  /**
   * Get a Lambda function by its method and path.
   * @param method HTTP method (e.g., 'GET', 'POST')
   * @param path Resource path (e.g., '/orders')
   * @returns The Lambda function or undefined if not found
   */
  public getFunction(
    method: string,
    path: string,
  ): lambda.Function | undefined {
    return this._functions[`${method} ${path}`];
  }

  private getOrCreateResource(
    path: string,
    resources: Record<string, apigateway.IResource>,
  ): apigateway.IResource {
    if (resources[path]) {
      return resources[path];
    }

    const parts = path.split("/").filter((p) => p);
    let current: apigateway.IResource = this.api.root;

    let currentPath = "";
    for (const part of parts) {
      currentPath += `/${part}`;
      if (resources[currentPath]) {
        current = resources[currentPath];
      } else {
        current = current.addResource(part);
        resources[currentPath] = current;
      }
    }

    return current;
  }
}
