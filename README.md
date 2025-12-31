# @yourorg/cdk-blueprints

Opinionated CDK constructs with organizational best practices baked in. Teams can deploy compliant, production-ready infrastructure with minimal configuration.

## Installation

```bash
npm install @yourorg/cdk-blueprints
```

## Quick Start

### ECS Fargate Service

Deploy a containerized service with ALB, auto-scaling, and logging:

```typescript
import { StandardFargateService } from '@yourorg/cdk-blueprints';

new StandardFargateService(this, 'OrderApi', {
  serviceName: 'order-api',
  environment: 'prod',
  image: '123456789.dkr.ecr.us-east-1.amazonaws.com/order-api:latest',
});
```

**What you get automatically:**
- VPC auto-discovery (excludes default VPC)
- Private subnet deployment
- Application Load Balancer
- Circuit breaker with rollback
- Auto-scaling (3-20 tasks for prod)
- CloudWatch logging with 1-year retention
- Standard tags (Service, Environment, ManagedBy)
- Health check configured at `/health`

### Lambda Function

Deploy a Lambda with tracing, logging, and cost-optimized defaults:

```typescript
import { StandardFunction } from '@yourorg/cdk-blueprints';

new StandardFunction(this, 'Processor', {
  serviceName: 'order-processor',
  environment: 'prod',
  codePath: 'lambda/order-processor',
});
```

**What you get automatically:**
- ARM64 architecture (cheaper)
- X-Ray tracing (staging/prod)
- Powertools Lambda layer
- Environment-based memory/timeout
- Log retention policies
- Standard tags

### REST API with Lambda

Deploy an API Gateway with multiple Lambda-backed endpoints:

```typescript
import { StandardApi } from '@yourorg/cdk-blueprints';

new StandardApi(this, 'OrdersApi', {
  serviceName: 'orders-api',
  environment: 'prod',
  endpoints: [
    {
      method: 'GET',
      path: '/orders',
      functionProps: { codePath: 'lambda/list-orders' },
    },
    {
      method: 'POST',
      path: '/orders',
      functionProps: { codePath: 'lambda/create-order' },
    },
    {
      method: 'GET',
      path: '/orders/{id}',
      functionProps: { codePath: 'lambda/get-order' },
    },
  ],
});
```

**What you get automatically:**
- Individual Lambda per endpoint
- CORS configured
- Throttling (1000 req/s default)
- Access logging
- X-Ray tracing

## Configuration

### Environment-Based Defaults

The `environment` prop automatically adjusts many settings:

| Setting | dev | staging | prod |
|---------|-----|---------|------|
| ECS min tasks | 1 | 2 | 3 |
| ECS max tasks | 2 | 4 | 20 |
| Lambda memory | 256 MB | 512 MB | 1024 MB |
| Lambda timeout | 30s | 60s | 120s |
| X-Ray tracing | Off | On | On |
| Log retention | 30 days | 90 days | 365 days |
| Container Insights | Off | Off | On |

### VPC Discovery

All constructs auto-discover your VPC:

```typescript
// Automatic - finds first non-default VPC
new StandardFargateService(this, 'Svc', { ... });

// By name
new StandardFargateService(this, 'Svc', {
  vpcName: 'production-vpc',
  ...
});

// Bring your own
new StandardFargateService(this, 'Svc', {
  vpc: myExistingVpc,
  ...
});
```

### Override Defaults

All constructs accept overrides:

```typescript
new StandardFargateService(this, 'HighMemory', {
  serviceName: 'ml-service',
  environment: 'prod',
  image: 'my-ml-image:latest',
  
  // Override defaults
  cpu: 4096,
  memoryMiB: 8192,
  scaling: {
    minCapacity: 5,
    maxCapacity: 50,
    targetCpuUtilization: 60,
  },
  healthCheckPath: '/api/health',
  publicLoadBalancer: true,
});
```

### Standard Tags

All resources get these tags automatically:

| Tag | Value |
|-----|-------|
| Service | `props.serviceName` |
| Environment | `props.environment` |
| ManagedBy | `cdk-blueprints` |
| Team | `props.team` (optional) |
| CostCenter | `props.costCenter` (optional) |

## Full Example

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  StandardFargateService,
  StandardFunction,
  StandardApi,
  VpcDiscovery,
} from '@yourorg/cdk-blueprints';

export class OrderServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Shared VPC lookup
    const { vpc } = new VpcDiscovery(this, 'Vpc');

    // Main API service
    const api = new StandardFargateService(this, 'Api', {
      serviceName: 'order-api',
      environment: 'prod',
      team: 'orders',
      costCenter: 'CC-1234',
      vpc,
      image: `${this.account}.dkr.ecr.${this.region}.amazonaws.com/order-api:latest`,
      containerPort: 3000,
      containerEnv: {
        DATABASE_URL: 'postgres://...',
      },
    });

    // Background processor
    const processor = new StandardFunction(this, 'Processor', {
      serviceName: 'order-processor',
      environment: 'prod',
      team: 'orders',
      costCenter: 'CC-1234',
      codePath: 'lambda/processor',
      deployInVpc: true,
      vpc,
    });

    // Webhook handler (doesn't need VPC)
    const webhook = new StandardFunction(this, 'Webhook', {
      serviceName: 'order-webhook',
      environment: 'prod',
      team: 'orders',
      codePath: 'lambda/webhook',
    });
  }
}

// app.ts
const app = new cdk.App();

new OrderServiceStack(app, 'OrderService-Prod', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
```

## Requirements

- Node.js 18+
- AWS CDK 2.150.0+
- AWS account with:
  - Non-default VPC
  - Proper subnet tagging (`aws-cdk:subnet-type`)

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Synthesize example
npm run integ
```

## Publishing

Managed by Projen. On merge to `main`:
1. Builds and tests
2. Bumps version (conventional commits)
3. Publishes to configured registry

## Contributing

1. Create feature branch
2. Make changes in `src/`
3. Add/update tests in `test/`
4. Run `npm test`
5. Submit PR

## License

MIT
