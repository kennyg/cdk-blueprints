# CDK Blueprint Library Generation Prompt

Use this prompt with Claude or another AI assistant to generate your organization's CDK blueprint library. Fill in the sections marked with `[FILL IN]` before using.

---

## The Prompt

```
I need to create an internal CDK construct library called "@[ORG_NAME]/cdk-blueprints" that provides opinionated, low-config constructs for our development teams. The goal is to encode our organizational best practices so teams can deploy compliant infrastructure with minimal configuration.

## Organization Context

**Company/Org Name:** [FILL IN - e.g., "acme"]
**Primary AWS Regions:** [FILL IN - e.g., "us-east-1, us-west-2"]
**Environments:** [FILL IN - e.g., "dev, staging, prod" or "sandbox, dev, qa, prod"]

**VPC Strategy:**
[FILL IN - Describe your VPC setup]
- Example: "We have one VPC per environment per region, named like 'acme-prod-us-east-1'. Teams should never use the default VPC. All workloads go in private subnets with NAT egress."

**Account Strategy:**
[FILL IN - Single account, multi-account, etc.]
- Example: "We use AWS Organizations with separate accounts per environment (dev account, staging account, prod account)."

## Required Constructs

Create these constructs with our standards baked in:

### 1. [CONSTRUCT_NAME] - [DESCRIPTION]
[FILL IN - Repeat this block for each construct you need]

**Use Case:** [When teams should use this]
**Underlying AWS Services:** [What it wraps]
**Required Inputs:**
- [input_name]: [description]
- [input_name]: [description]

**Our Standards:**
- [Standard 1 - e.g., "Always deploy in private subnets"]
- [Standard 2 - e.g., "Enable X-Ray tracing in staging/prod"]
- [Standard 3 - e.g., "Use ARM64 architecture for cost savings"]

**Environment-Based Defaults:**
| Setting | dev | staging | prod |
|---------|-----|---------|------|
| [setting] | [value] | [value] | [value] |

**Optional Overrides:** [What teams should be able to customize]

---

### Example Constructs (delete or modify as needed):

### 1. StandardFargateService - Containerized web services
**Use Case:** HTTP APIs and web applications running in containers
**Underlying AWS Services:** ECS Fargate, ALB, CloudWatch Logs, Auto Scaling

**Required Inputs:**
- serviceName: Identifier for the service
- environment: dev/staging/prod
- image: Container image URI

**Our Standards:**
- [FILL IN your ECS standards]
- Example: "Circuit breaker with rollback enabled"
- Example: "Container Insights enabled for prod"
- Example: "Internal ALB by default (no public exposure)"

**Environment-Based Defaults:**
| Setting | dev | staging | prod |
|---------|-----|---------|------|
| Min tasks | [X] | [X] | [X] |
| Max tasks | [X] | [X] | [X] |
| CPU | [X] | [X] | [X] |
| Memory | [X] | [X] | [X] |
| Log retention | [X days] | [X days] | [X days] |

---

### 2. StandardFunction - Lambda functions
**Use Case:** Event handlers, background processors, API backends
**Underlying AWS Services:** Lambda, CloudWatch Logs, X-Ray

**Required Inputs:**
- serviceName: Identifier for the function
- environment: dev/staging/prod
- codePath: Path to Lambda code

**Our Standards:**
- [FILL IN your Lambda standards]
- Example: "ARM64 architecture for cost optimization"
- Example: "Powertools layer included by default"
- Example: "Structured JSON logging"

**Environment-Based Defaults:**
| Setting | dev | staging | prod |
|---------|-----|---------|------|
| Memory (MB) | [X] | [X] | [X] |
| Timeout (sec) | [X] | [X] | [X] |
| X-Ray tracing | [on/off] | [on/off] | [on/off] |
| Log retention | [X days] | [X days] | [X days] |

---

### 3. [ADD MORE CONSTRUCTS AS NEEDED]
Examples you might want:
- StandardQueue (SQS with DLQ)
- StandardTable (DynamoDB with backups)
- StandardBucket (S3 with encryption, lifecycle)
- StandardApi (API Gateway + Lambda)
- StandardStateMachine (Step Functions)
- StandardDatabase (RDS/Aurora)
- StandardCache (ElastiCache)

---

## Tagging Standards

All resources must be tagged with:

| Tag | Source | Required |
|-----|--------|----------|
| [FILL IN tag name] | [FILL IN - prop or auto] | [yes/no] |

Example:
| Tag | Source | Required |
|-----|--------|----------|
| Service | props.serviceName | yes |
| Environment | props.environment | yes |
| Team | props.team | yes |
| CostCenter | props.costCenter | no |
| ManagedBy | "cdk-blueprints" (auto) | yes |

---

## Naming Conventions

Resources should be named: [FILL IN your pattern]
- Example: `{serviceName}-{environment}-{resourceType}`
- Example: `{team}-{serviceName}-{environment}`

---

## Observability Standards

**Logging:**
[FILL IN - e.g., "JSON structured logs, shipped to Datadog via Firehose"]

**Metrics:**
[FILL IN - e.g., "CloudWatch Container Insights for ECS, custom metrics namespace per service"]

**Tracing:**
[FILL IN - e.g., "X-Ray enabled for all prod workloads, sampled at 5%"]

**Alerting:**
[FILL IN - e.g., "PagerDuty integration for prod, Slack for non-prod"]

---

## Security Standards

**Network:**
[FILL IN - e.g., "No public subnets for compute, all egress via NAT, VPC endpoints for AWS services"]

**IAM:**
[FILL IN - e.g., "Least privilege, no wildcards in production, service-linked roles preferred"]

**Encryption:**
[FILL IN - e.g., "KMS CMK for prod, AWS managed keys for non-prod, encryption at rest required"]

**Secrets:**
[FILL IN - e.g., "Secrets Manager for all credentials, no environment variables for secrets"]

---

## Distribution Strategy

How will teams consume this library?

[FILL IN - Pick one or describe your approach]
- [ ] AWS CodeArtifact (private npm registry)
- [ ] GitHub Packages
- [ ] GitLab Registry
- [ ] npm (public - unlikely for internal)
- [ ] Monorepo (library lives alongside apps)
- [ ] Git submodule

---

## Project Setup

**Use Projen:** [yes/no - recommended: yes]
**Languages to support:** [TypeScript only / TypeScript + Python / All via JSII]
**Minimum CDK version:** [FILL IN - e.g., "2.150.0"]

---

## Output Requirements

Please generate:

1. **Complete project structure** with all files
2. **Projen configuration** (.projenrc.ts)
3. **All construct implementations** with:
   - Full TypeScript types/interfaces
   - JSDoc comments for documentation
   - Sensible defaults based on my standards above
   - Escape hatches for all defaults
4. **Unit tests** demonstrating key behaviors
5. **README.md** with:
   - Installation instructions
   - Quick start examples for each construct
   - Configuration reference tables
   - Full example stack
6. **package.json** configured for my distribution strategy

Make the constructs as low-config as possible - teams should be able to deploy with just serviceName, environment, and the resource-specific required input (image, codePath, etc.).
```

---

## Quick-Start Version (Minimal Prompt)

If you want a faster starting point, use this shorter version:

```
Create a CDK construct library called "@[ORG]/cdk-blueprints" with these opinionated constructs:

1. StandardFargateService - ECS Fargate behind ALB
2. StandardFunction - Lambda with tracing/logging
3. StandardApi - API Gateway + Lambda backends
4. StandardQueue - SQS with DLQ
5. StandardTable - DynamoDB with backups

Requirements:
- Environment prop (dev/staging/prod) controls scaling, memory, timeouts, log retention
- Auto-discovers VPC (excludes default VPC)
- Standard tags: Service, Environment, Team, CostCenter, ManagedBy
- All resources in private subnets by default
- Circuit breakers, health checks, auto-scaling configured automatically
- Minimal required inputs - just serviceName, environment, and resource-specific config

Our defaults:
- Prod: 3-20 tasks, 1024MB Lambda, 1yr logs, X-Ray on
- Staging: 2-4 tasks, 512MB Lambda, 90d logs, X-Ray on  
- Dev: 1-2 tasks, 256MB Lambda, 30d logs, X-Ray off

Use Projen for project setup. Output complete TypeScript implementation with tests and README.
```

---

## Tips for Best Results

1. **Be specific about your standards** - The more detail you provide, the better the output
2. **Include real values** - Don't leave `[X]` placeholders, fill in your actual numbers
3. **Describe edge cases** - "In dev, allow public ALBs for testing"
4. **Mention constraints** - "We can't use Container Insights due to cost" 
5. **Reference existing patterns** - "Similar to how AWS Solutions Constructs works"

## After Generation

1. Review the generated code against your security policies
2. Test with `cdk synth` against a real account
3. Run `cdk-nag` to validate compliance
4. Have your platform/security team review before publishing
5. Start with one team as pilot before org-wide rollout
