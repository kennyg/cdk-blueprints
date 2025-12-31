# Example: Filled-In Blueprint Prompt

This shows what a completed prompt looks like. Use this as a reference when filling in your own.

---

```
I need to create an internal CDK construct library called "@acme/cdk-blueprints" that provides opinionated, low-config constructs for our development teams. The goal is to encode our organizational best practices so teams can deploy compliant infrastructure with minimal configuration.

## Organization Context

**Company/Org Name:** acme
**Primary AWS Regions:** us-east-1 (primary), us-west-2 (DR)
**Environments:** dev, staging, prod

**VPC Strategy:**
- One VPC per account, managed by our platform team via Terraform
- VPCs are named: "acme-{environment}-{region}" (e.g., "acme-prod-us-east-1")
- Subnets tagged with "aws-cdk:subnet-type" for CDK discovery
- All compute workloads must run in private subnets
- NAT Gateways in each AZ for egress
- VPC endpoints for S3, DynamoDB, ECR, CloudWatch, Secrets Manager

**Account Strategy:**
- AWS Organizations with 4 accounts: shared-services, dev, staging, prod
- Each environment is a separate account
- Cross-account ECR access from shared-services account
- Centralized logging to shared-services account

## Required Constructs

### 1. StandardFargateService - Containerized HTTP services
**Use Case:** REST APIs, GraphQL services, web applications
**Underlying AWS Services:** ECS Fargate, ALB, CloudWatch Logs, Application Auto Scaling, ECR

**Required Inputs:**
- serviceName: Service identifier (used for naming, tagging, logs)
- environment: dev/staging/prod
- image: ECR image URI

**Our Standards:**
- Always deploy in private subnets with NAT egress
- Internal ALB by default (publicLoadBalancer: false)
- Circuit breaker with automatic rollback enabled
- ECS Exec enabled in dev only (for debugging)
- Container Insights enabled in prod only (cost)
- Propagate tags from service to tasks
- Health check at /health endpoint
- JSON structured logging via awslogs driver
- Security group allows only ALB ingress

**Environment-Based Defaults:**
| Setting | dev | staging | prod |
|---------|-----|---------|------|
| Min tasks | 1 | 2 | 3 |
| Max tasks | 2 | 5 | 20 |
| CPU | 256 | 512 | 1024 |
| Memory (MB) | 512 | 1024 | 2048 |
| Log retention | 14 days | 30 days | 365 days |
| Target CPU % | 80 | 75 | 70 |
| Deregistration delay | 30s | 60s | 120s |

**Optional Overrides:** cpu, memory, scaling config, health check path, public ALB, custom env vars

---

### 2. StandardFunction - Lambda functions
**Use Case:** Event processors, API handlers, scheduled jobs, queue consumers
**Underlying AWS Services:** Lambda, CloudWatch Logs, X-Ray, Secrets Manager

**Required Inputs:**
- serviceName: Function identifier
- environment: dev/staging/prod
- codePath: Path to Lambda code directory

**Our Standards:**
- ARM64 architecture (Graviton2 - 20% cheaper)
- Node.js 20.x runtime default (also support Python 3.12)
- Powertools for AWS Lambda layer included
- Structured JSON logging with correlation IDs
- X-Ray tracing in staging/prod
- No VPC by default (faster cold starts), opt-in for DB access
- Reserved concurrency not set by default (shared pool)
- 2 retry attempts on async invocation
- DLQ required for async event sources

**Environment-Based Defaults:**
| Setting | dev | staging | prod |
|---------|-----|---------|------|
| Memory (MB) | 256 | 512 | 1024 |
| Timeout (sec) | 30 | 60 | 120 |
| X-Ray | off | active | active |
| Log retention | 7 days | 30 days | 90 days |
| Log level | DEBUG | INFO | INFO |

**Optional Overrides:** memory, timeout, VPC deployment, reserved concurrency, layers, runtime

---

### 3. StandardApi - REST API with Lambda backends
**Use Case:** Public or internal REST APIs with multiple endpoints
**Underlying AWS Services:** API Gateway REST API, Lambda, CloudWatch Logs, WAF (prod)

**Required Inputs:**
- serviceName: API identifier
- environment: dev/staging/prod
- endpoints: Array of {method, path, functionProps}

**Our Standards:**
- One Lambda per endpoint (not monolithic)
- CORS enabled, origins restricted in prod
- Request throttling: 1000 req/s rate, 2000 burst
- Access logging to CloudWatch in JSON format
- X-Ray tracing in staging/prod
- API keys required for external APIs
- WAF attached in prod (managed rule set)
- Custom domain via Route53 (optional)

**Environment-Based Defaults:**
| Setting | dev | staging | prod |
|---------|-----|---------|------|
| Throttle rate | 100 | 500 | 1000 |
| Throttle burst | 200 | 1000 | 2000 |
| CORS origins | * | *.acme-staging.com | *.acme.com |
| WAF | off | off | on |
| Cache TTL | 0 | 0 | 300s |

---

### 4. StandardQueue - SQS queue with DLQ
**Use Case:** Async messaging, event buffering, job queues
**Underlying AWS Services:** SQS, CloudWatch Alarms

**Required Inputs:**
- serviceName: Queue identifier
- environment: dev/staging/prod

**Our Standards:**
- Dead letter queue always created
- 3 receive attempts before DLQ
- Visibility timeout: 6x Lambda timeout (if used with Lambda)
- Server-side encryption with AWS managed key (KMS CMK in prod)
- CloudWatch alarm on DLQ depth > 0
- Message retention: 4 days (DLQ: 14 days)

**Environment-Based Defaults:**
| Setting | dev | staging | prod |
|---------|-----|---------|------|
| Encryption | SQS managed | SQS managed | KMS CMK |
| DLQ alarm | off | Slack | PagerDuty |

---

### 5. StandardTable - DynamoDB table
**Use Case:** Key-value storage, session state, application data
**Underlying AWS Services:** DynamoDB, CloudWatch, AWS Backup

**Required Inputs:**
- serviceName: Table identifier
- environment: dev/staging/prod
- partitionKey: {name, type}

**Our Standards:**
- On-demand billing (no capacity planning)
- Point-in-time recovery enabled in staging/prod
- Server-side encryption with AWS managed key
- TTL attribute named "expiresAt" if needed
- Global secondary indexes as separate construct method
- Deletion protection in prod

**Environment-Based Defaults:**
| Setting | dev | staging | prod |
|---------|-----|---------|------|
| Billing | on-demand | on-demand | on-demand |
| PITR | off | on | on |
| Deletion protection | off | off | on |
| Backup | none | daily | daily |

---

## Tagging Standards

All resources must be tagged with:

| Tag | Source | Required |
|-----|--------|----------|
| Service | props.serviceName | yes |
| Environment | props.environment | yes |
| Team | props.team | yes |
| CostCenter | props.costCenter | no |
| ManagedBy | "cdk-blueprints" (auto) | yes |
| Repository | props.repository | no |
| OnCall | props.onCallTeam | no |

---

## Naming Conventions

Resources should be named: `{serviceName}-{environment}[-{suffix}]`
- ECS Service: `order-api-prod`
- Lambda: `order-processor-prod`
- ALB: `order-api-prod-alb`
- Log Group: `/acme/{serviceName}/{environment}`

---

## Observability Standards

**Logging:**
- JSON structured logs with fields: timestamp, level, message, service, environment, traceId
- All logs shipped to Datadog via CloudWatch subscription filter
- Log group naming: `/acme/{service}/{environment}`

**Metrics:**
- CloudWatch Container Insights for ECS (prod only)
- Custom metrics namespace: `Acme/{ServiceName}`
- Datadog agent sidecar for ECS services (future)

**Tracing:**
- X-Ray for all staging/prod workloads
- Sampling rate: 5% in prod, 100% in staging
- Trace IDs propagated via X-Amzn-Trace-Id header

**Alerting:**
- Prod: PagerDuty integration for P1/P2
- Non-prod: Slack #alerts-{team} channel
- Alert on: 5xx rate > 1%, latency p99 > 1s, DLQ depth > 0

---

## Security Standards

**Network:**
- All compute in private subnets
- No direct internet ingress (ALB only)
- VPC endpoints for AWS services
- Security groups: least privilege, no 0.0.0.0/0

**IAM:**
- Task roles with least privilege
- No inline policies, managed policies preferred
- No wildcard resources in prod
- Boundary policies enforced via SCP

**Encryption:**
- At rest: KMS CMK for prod, AWS managed for non-prod
- In transit: TLS 1.2+ required
- Secrets: Secrets Manager, never env vars

**Secrets:**
- Secrets Manager for all credentials
- Rotation enabled for DB credentials
- No secrets in container environment variables
- Reference via ARN, resolve at runtime

---

## Distribution Strategy

**AWS CodeArtifact**
- Domain: acme-artifacts
- Repository: npm-internal
- Teams install via: `npm install @acme/cdk-blueprints`
- CI/CD publishes on merge to main

---

## Project Setup

**Use Projen:** yes
**Languages to support:** TypeScript only (teams use TypeScript CDK)
**Minimum CDK version:** 2.150.0
**Node.js version:** 20.x

---

## Output Requirements

Please generate:

1. Complete project structure with all files
2. Projen configuration (.projenrc.ts) set up for CodeArtifact publishing
3. All 5 construct implementations with full TypeScript types
4. Unit tests for each construct
5. README.md with installation, quick start, and full examples
6. package.json configured for CodeArtifact

Make the constructs as low-config as possible. A team should be able to deploy a production-ready service with just:

```typescript
new StandardFargateService(this, 'Api', {
  serviceName: 'order-api',
  environment: 'prod',
  team: 'orders',
  image: '123456789.dkr.ecr.us-east-1.amazonaws.com/order-api:latest',
});
```
```

---

## What This Produces

With a prompt like this, you'll get:
- 5 fully implemented constructs
- Environment-aware defaults throughout
- VPC auto-discovery
- Consistent tagging
- Proper logging/tracing
- Security best practices
- Test coverage
- Comprehensive documentation

The key is being specific about YOUR standards - don't use generic values, use your actual numbers, policies, and patterns.
