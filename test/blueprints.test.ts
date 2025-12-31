import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import { StandardFargateService } from "../src/ecs/standard-fargate-service";
import { StandardFunction } from "../src/lambda/standard-function";

// Mock VPC lookup for testing
jest.mock("aws-cdk-lib/aws-ec2", () => {
  const actual = jest.requireActual("aws-cdk-lib/aws-ec2");
  return {
    ...actual,
    Vpc: {
      ...actual.Vpc,
      fromLookup: jest.fn().mockReturnValue({
        vpcId: "vpc-12345",
        availabilityZones: ["us-east-1a", "us-east-1b"],
        publicSubnets: [],
        privateSubnets: [
          { subnetId: "subnet-1", availabilityZone: "us-east-1a" },
          { subnetId: "subnet-2", availabilityZone: "us-east-1b" },
        ],
        isolatedSubnets: [],
        selectSubnets: jest.fn().mockReturnValue({
          subnets: [
            { subnetId: "subnet-1", availabilityZone: "us-east-1a" },
            { subnetId: "subnet-2", availabilityZone: "us-east-1b" },
          ],
          availabilityZones: ["us-east-1a", "us-east-1b"],
          subnetIds: ["subnet-1", "subnet-2"],
          hasPublic: false,
        }),
      }),
    },
  };
});

describe("StandardFargateService", () => {
  test("creates service with default configuration", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack", {
      env: { account: "123456789012", region: "us-east-1" },
    });

    new StandardFargateService(stack, "TestService", {
      serviceName: "test-api",
      environment: "dev",
      image: "nginx:latest",
    });

    const template = Template.fromStack(stack);

    // Verify ECS service is created
    template.hasResourceProperties("AWS::ECS::Service", {
      LaunchType: "FARGATE",
    });

    // Verify circuit breaker is enabled
    template.hasResourceProperties("AWS::ECS::Service", {
      DeploymentConfiguration: {
        DeploymentCircuitBreaker: {
          Enable: true,
          Rollback: true,
        },
      },
    });

    // Verify standard tags are present
    template.hasResourceProperties("AWS::ECS::Service", {
      Tags: Match.arrayWith([
        Match.objectLike({ Key: "Service", Value: "test-api" }),
      ]),
    });
  });

  test("scales based on environment", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack", {
      env: { account: "123456789012", region: "us-east-1" },
    });

    new StandardFargateService(stack, "ProdService", {
      serviceName: "prod-api",
      environment: "prod",
      image: "nginx:latest",
    });

    const template = Template.fromStack(stack);

    // Verify auto-scaling is configured for prod
    template.hasResourceProperties(
      "AWS::ApplicationAutoScaling::ScalableTarget",
      {
        MinCapacity: 3,
        MaxCapacity: 20,
      },
    );
  });
});

describe("StandardFunction", () => {
  test("creates function with default configuration", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack", {
      env: { account: "123456789012", region: "us-east-1" },
    });

    new StandardFunction(stack, "TestFunction", {
      serviceName: "test-processor",
      environment: "dev",
      codePath: "test/fixtures/lambda", // Would need fixture
    });

    const template = Template.fromStack(stack);

    // Verify Lambda is created with ARM64
    template.hasResourceProperties("AWS::Lambda::Function", {
      Architectures: ["arm64"],
      Runtime: "nodejs20.x",
    });
  });

  test("enables tracing for prod", () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack", {
      env: { account: "123456789012", region: "us-east-1" },
    });

    new StandardFunction(stack, "ProdFunction", {
      serviceName: "prod-processor",
      environment: "prod",
      codePath: "test/fixtures/lambda",
    });

    const template = Template.fromStack(stack);

    // Verify X-Ray tracing is enabled
    template.hasResourceProperties("AWS::Lambda::Function", {
      TracingConfig: {
        Mode: "Active",
      },
    });
  });
});
