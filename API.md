# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### StandardApi <a name="StandardApi" id="@yourorg/cdk-blueprints.StandardApi"></a>

Opinionated REST API with Lambda backends:.

Multiple endpoints with individual Lambda functions
- Throttling configured per environment
- CORS enabled by default
- Access logging
- Standard tagging

*Example*

```typescript
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
  ],
});
```


#### Initializers <a name="Initializers" id="@yourorg/cdk-blueprints.StandardApi.Initializer"></a>

```typescript
import { StandardApi } from '@yourorg/cdk-blueprints'

new StandardApi(scope: Construct, id: string, props: StandardApiProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.Initializer.parameter.props">props</a></code> | <code><a href="#@yourorg/cdk-blueprints.StandardApiProps">StandardApiProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@yourorg/cdk-blueprints.StandardApi.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@yourorg/cdk-blueprints.StandardApi.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@yourorg/cdk-blueprints.StandardApi.Initializer.parameter.props"></a>

- *Type:* <a href="#@yourorg/cdk-blueprints.StandardApiProps">StandardApiProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.getFunction">getFunction</a></code> | Get a Lambda function by its method and path. |

---

##### `toString` <a name="toString" id="@yourorg/cdk-blueprints.StandardApi.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `getFunction` <a name="getFunction" id="@yourorg/cdk-blueprints.StandardApi.getFunction"></a>

```typescript
public getFunction(method: string, path: string): Function
```

Get a Lambda function by its method and path.

###### `method`<sup>Required</sup> <a name="method" id="@yourorg/cdk-blueprints.StandardApi.getFunction.parameter.method"></a>

- *Type:* string

HTTP method (e.g., 'GET', 'POST').

---

###### `path`<sup>Required</sup> <a name="path" id="@yourorg/cdk-blueprints.StandardApi.getFunction.parameter.path"></a>

- *Type:* string

Resource path (e.g., '/orders').

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@yourorg/cdk-blueprints.StandardApi.isConstruct"></a>

```typescript
import { StandardApi } from '@yourorg/cdk-blueprints'

StandardApi.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@yourorg/cdk-blueprints.StandardApi.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigateway.RestApi</code> | The API Gateway REST API. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApi.property.apiUrl">apiUrl</a></code> | <code>string</code> | The API endpoint URL. |

---

##### `node`<sup>Required</sup> <a name="node" id="@yourorg/cdk-blueprints.StandardApi.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `api`<sup>Required</sup> <a name="api" id="@yourorg/cdk-blueprints.StandardApi.property.api"></a>

```typescript
public readonly api: RestApi;
```

- *Type:* aws-cdk-lib.aws_apigateway.RestApi

The API Gateway REST API.

---

##### `apiUrl`<sup>Required</sup> <a name="apiUrl" id="@yourorg/cdk-blueprints.StandardApi.property.apiUrl"></a>

```typescript
public readonly apiUrl: string;
```

- *Type:* string

The API endpoint URL.

---


### StandardFargateService <a name="StandardFargateService" id="@yourorg/cdk-blueprints.StandardFargateService"></a>

Opinionated Fargate service with organizational best practices:.

Auto-discovers VPC (excludes default)
- Private subnets by default
- Circuit breaker with rollback
- Environment-based auto-scaling
- Centralized logging with retention policies
- Standard tagging
- Health checks configured

*Example*

```typescript
new StandardFargateService(this, 'Api', {
  serviceName: 'order-api',
  environment: 'prod',
  image: '123456789.dkr.ecr.us-east-1.amazonaws.com/order-api:latest',
});
```


#### Initializers <a name="Initializers" id="@yourorg/cdk-blueprints.StandardFargateService.Initializer"></a>

```typescript
import { StandardFargateService } from '@yourorg/cdk-blueprints'

new StandardFargateService(scope: Construct, id: string, props: StandardFargateServiceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.Initializer.parameter.props">props</a></code> | <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps">StandardFargateServiceProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@yourorg/cdk-blueprints.StandardFargateService.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@yourorg/cdk-blueprints.StandardFargateService.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@yourorg/cdk-blueprints.StandardFargateService.Initializer.parameter.props"></a>

- *Type:* <a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps">StandardFargateServiceProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@yourorg/cdk-blueprints.StandardFargateService.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@yourorg/cdk-blueprints.StandardFargateService.isConstruct"></a>

```typescript
import { StandardFargateService } from '@yourorg/cdk-blueprints'

StandardFargateService.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@yourorg/cdk-blueprints.StandardFargateService.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.property.cluster">cluster</a></code> | <code>aws-cdk-lib.aws_ecs.ICluster</code> | The ECS cluster. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.property.loadBalancerDnsName">loadBalancerDnsName</a></code> | <code>string</code> | The ALB DNS name. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | CloudWatch log group for container logs. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.property.service">service</a></code> | <code>aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedFargateService</code> | The underlying ECS service. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateService.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | The VPC. |

---

##### `node`<sup>Required</sup> <a name="node" id="@yourorg/cdk-blueprints.StandardFargateService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `cluster`<sup>Required</sup> <a name="cluster" id="@yourorg/cdk-blueprints.StandardFargateService.property.cluster"></a>

```typescript
public readonly cluster: ICluster;
```

- *Type:* aws-cdk-lib.aws_ecs.ICluster

The ECS cluster.

---

##### `loadBalancerDnsName`<sup>Required</sup> <a name="loadBalancerDnsName" id="@yourorg/cdk-blueprints.StandardFargateService.property.loadBalancerDnsName"></a>

```typescript
public readonly loadBalancerDnsName: string;
```

- *Type:* string

The ALB DNS name.

---

##### `logGroup`<sup>Required</sup> <a name="logGroup" id="@yourorg/cdk-blueprints.StandardFargateService.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

CloudWatch log group for container logs.

---

##### `service`<sup>Required</sup> <a name="service" id="@yourorg/cdk-blueprints.StandardFargateService.property.service"></a>

```typescript
public readonly service: ApplicationLoadBalancedFargateService;
```

- *Type:* aws-cdk-lib.aws_ecs_patterns.ApplicationLoadBalancedFargateService

The underlying ECS service.

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="@yourorg/cdk-blueprints.StandardFargateService.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

The VPC.

---


### StandardFunction <a name="StandardFunction" id="@yourorg/cdk-blueprints.StandardFunction"></a>

Opinionated Lambda function with organizational best practices:.

Environment-based memory/timeout defaults
- X-Ray tracing enabled for staging/prod
- Structured logging via Powertools
- ARM64 architecture for cost savings
- Standard tagging
- Optional VPC deployment with auto-discovery

*Example*

```typescript
new StandardFunction(this, 'Processor', {
  serviceName: 'order-processor',
  environment: 'prod',
  codePath: 'lambda/order-processor',
});
```


#### Initializers <a name="Initializers" id="@yourorg/cdk-blueprints.StandardFunction.Initializer"></a>

```typescript
import { StandardFunction } from '@yourorg/cdk-blueprints'

new StandardFunction(scope: Construct, id: string, props: StandardFunctionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.Initializer.parameter.props">props</a></code> | <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps">StandardFunctionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@yourorg/cdk-blueprints.StandardFunction.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@yourorg/cdk-blueprints.StandardFunction.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@yourorg/cdk-blueprints.StandardFunction.Initializer.parameter.props"></a>

- *Type:* <a href="#@yourorg/cdk-blueprints.StandardFunctionProps">StandardFunctionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.addEventSource">addEventSource</a></code> | Add an event source to the function. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.grantInvoke">grantInvoke</a></code> | Grant invoke permissions to another principal. |

---

##### `toString` <a name="toString" id="@yourorg/cdk-blueprints.StandardFunction.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addEventSource` <a name="addEventSource" id="@yourorg/cdk-blueprints.StandardFunction.addEventSource"></a>

```typescript
public addEventSource(source: IEventSource): void
```

Add an event source to the function.

###### `source`<sup>Required</sup> <a name="source" id="@yourorg/cdk-blueprints.StandardFunction.addEventSource.parameter.source"></a>

- *Type:* aws-cdk-lib.aws_lambda.IEventSource

---

##### `grantInvoke` <a name="grantInvoke" id="@yourorg/cdk-blueprints.StandardFunction.grantInvoke"></a>

```typescript
public grantInvoke(grantee: IGrantable): Grant
```

Grant invoke permissions to another principal.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@yourorg/cdk-blueprints.StandardFunction.grantInvoke.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@yourorg/cdk-blueprints.StandardFunction.isConstruct"></a>

```typescript
import { StandardFunction } from '@yourorg/cdk-blueprints'

StandardFunction.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@yourorg/cdk-blueprints.StandardFunction.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.property.function">function</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | The Lambda function. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.property.functionArn">functionArn</a></code> | <code>string</code> | The function ARN. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.property.functionName">functionName</a></code> | <code>string</code> | The function name. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunction.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.LogGroup</code> | The CloudWatch log group. |

---

##### `node`<sup>Required</sup> <a name="node" id="@yourorg/cdk-blueprints.StandardFunction.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `function`<sup>Required</sup> <a name="function" id="@yourorg/cdk-blueprints.StandardFunction.property.function"></a>

```typescript
public readonly function: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

The Lambda function.

---

##### `functionArn`<sup>Required</sup> <a name="functionArn" id="@yourorg/cdk-blueprints.StandardFunction.property.functionArn"></a>

```typescript
public readonly functionArn: string;
```

- *Type:* string

The function ARN.

---

##### `functionName`<sup>Required</sup> <a name="functionName" id="@yourorg/cdk-blueprints.StandardFunction.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* string

The function name.

---

##### `logGroup`<sup>Required</sup> <a name="logGroup" id="@yourorg/cdk-blueprints.StandardFunction.property.logGroup"></a>

```typescript
public readonly logGroup: LogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.LogGroup

The CloudWatch log group.

---


### VpcDiscovery <a name="VpcDiscovery" id="@yourorg/cdk-blueprints.VpcDiscovery"></a>

Zero-config VPC discovery that excludes default VPC.

*Example*

```typescript
const { vpc, privateSubnets } = new VpcDiscovery(this, 'Vpc');

new ec2.Instance(this, 'Instance', {
  vpc,
  vpcSubnets: privateSubnets,
  // ...
});
```


#### Initializers <a name="Initializers" id="@yourorg/cdk-blueprints.VpcDiscovery.Initializer"></a>

```typescript
import { VpcDiscovery } from '@yourorg/cdk-blueprints'

new VpcDiscovery(scope: Construct, id: string, props?: VpcDiscoveryProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.Initializer.parameter.props">props</a></code> | <code><a href="#@yourorg/cdk-blueprints.VpcDiscoveryProps">VpcDiscoveryProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@yourorg/cdk-blueprints.VpcDiscovery.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@yourorg/cdk-blueprints.VpcDiscovery.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@yourorg/cdk-blueprints.VpcDiscovery.Initializer.parameter.props"></a>

- *Type:* <a href="#@yourorg/cdk-blueprints.VpcDiscoveryProps">VpcDiscoveryProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@yourorg/cdk-blueprints.VpcDiscovery.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@yourorg/cdk-blueprints.VpcDiscovery.isConstruct"></a>

```typescript
import { VpcDiscovery } from '@yourorg/cdk-blueprints'

VpcDiscovery.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@yourorg/cdk-blueprints.VpcDiscovery.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.property.isolatedSubnets">isolatedSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Subnet selection for isolated subnets (no internet). |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.property.privateSubnets">privateSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Subnet selection for private subnets with egress (NAT). |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.property.publicSubnets">publicSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Subnet selection for public subnets. |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscovery.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | The discovered VPC. |

---

##### `node`<sup>Required</sup> <a name="node" id="@yourorg/cdk-blueprints.VpcDiscovery.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `isolatedSubnets`<sup>Required</sup> <a name="isolatedSubnets" id="@yourorg/cdk-blueprints.VpcDiscovery.property.isolatedSubnets"></a>

```typescript
public readonly isolatedSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

Subnet selection for isolated subnets (no internet).

---

##### `privateSubnets`<sup>Required</sup> <a name="privateSubnets" id="@yourorg/cdk-blueprints.VpcDiscovery.property.privateSubnets"></a>

```typescript
public readonly privateSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

Subnet selection for private subnets with egress (NAT).

---

##### `publicSubnets`<sup>Required</sup> <a name="publicSubnets" id="@yourorg/cdk-blueprints.VpcDiscovery.property.publicSubnets"></a>

```typescript
public readonly publicSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

Subnet selection for public subnets.

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="@yourorg/cdk-blueprints.VpcDiscovery.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

The discovered VPC.

---


## Structs <a name="Structs" id="Structs"></a>

### ApiEndpoint <a name="ApiEndpoint" id="@yourorg/cdk-blueprints.ApiEndpoint"></a>

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.ApiEndpoint.Initializer"></a>

```typescript
import { ApiEndpoint } from '@yourorg/cdk-blueprints'

const apiEndpoint: ApiEndpoint = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.ApiEndpoint.property.functionProps">functionProps</a></code> | <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps">EndpointFunctionProps</a></code> | Lambda function props for this endpoint. |
| <code><a href="#@yourorg/cdk-blueprints.ApiEndpoint.property.method">method</a></code> | <code>string</code> | HTTP method (GET, POST, PUT, DELETE, etc.). |
| <code><a href="#@yourorg/cdk-blueprints.ApiEndpoint.property.path">path</a></code> | <code>string</code> | Resource path (e.g., '/users', '/orders/{id}'). |

---

##### `functionProps`<sup>Required</sup> <a name="functionProps" id="@yourorg/cdk-blueprints.ApiEndpoint.property.functionProps"></a>

```typescript
public readonly functionProps: EndpointFunctionProps;
```

- *Type:* <a href="#@yourorg/cdk-blueprints.EndpointFunctionProps">EndpointFunctionProps</a>

Lambda function props for this endpoint.

---

##### `method`<sup>Required</sup> <a name="method" id="@yourorg/cdk-blueprints.ApiEndpoint.property.method"></a>

```typescript
public readonly method: string;
```

- *Type:* string

HTTP method (GET, POST, PUT, DELETE, etc.).

---

##### `path`<sup>Required</sup> <a name="path" id="@yourorg/cdk-blueprints.ApiEndpoint.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* string

Resource path (e.g., '/users', '/orders/{id}').

---

### BlueprintBaseProps <a name="BlueprintBaseProps" id="@yourorg/cdk-blueprints.BlueprintBaseProps"></a>

Common configuration for all blueprint constructs.

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.BlueprintBaseProps.Initializer"></a>

```typescript
import { BlueprintBaseProps } from '@yourorg/cdk-blueprints'

const blueprintBaseProps: BlueprintBaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.BlueprintBaseProps.property.environment">environment</a></code> | <code>string</code> | The deployment environment. |
| <code><a href="#@yourorg/cdk-blueprints.BlueprintBaseProps.property.serviceName">serviceName</a></code> | <code>string</code> | Service/application name. |
| <code><a href="#@yourorg/cdk-blueprints.BlueprintBaseProps.property.costCenter">costCenter</a></code> | <code>string</code> | Cost center for billing. |
| <code><a href="#@yourorg/cdk-blueprints.BlueprintBaseProps.property.team">team</a></code> | <code>string</code> | Team that owns this service. |

---

##### `environment`<sup>Required</sup> <a name="environment" id="@yourorg/cdk-blueprints.BlueprintBaseProps.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

The deployment environment.

Affects scaling, redundancy, and other defaults.

---

##### `serviceName`<sup>Required</sup> <a name="serviceName" id="@yourorg/cdk-blueprints.BlueprintBaseProps.property.serviceName"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* string

Service/application name.

Used for naming, tagging, and observability.

---

##### `costCenter`<sup>Optional</sup> <a name="costCenter" id="@yourorg/cdk-blueprints.BlueprintBaseProps.property.costCenter"></a>

```typescript
public readonly costCenter: string;
```

- *Type:* string

Cost center for billing.

Used for tagging.

---

##### `team`<sup>Optional</sup> <a name="team" id="@yourorg/cdk-blueprints.BlueprintBaseProps.property.team"></a>

```typescript
public readonly team: string;
```

- *Type:* string

Team that owns this service.

Used for tagging and cost allocation.

---

### EndpointFunctionProps <a name="EndpointFunctionProps" id="@yourorg/cdk-blueprints.EndpointFunctionProps"></a>

Props for an individual endpoint's Lambda function.

This is a subset of StandardFunctionProps without the base props that are inherited from the API.

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.EndpointFunctionProps.Initializer"></a>

```typescript
import { EndpointFunctionProps } from '@yourorg/cdk-blueprints'

const endpointFunctionProps: EndpointFunctionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.codePath">codePath</a></code> | <code>string</code> | Path to the Lambda code directory or file. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.additionalPolicies">additionalPolicies</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | Additional IAM policies to attach to the function role. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | Architecture. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.deployInVpc">deployInVpc</a></code> | <code>boolean</code> | Whether to deploy in VPC. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.enablePowertools">enablePowertools</a></code> | <code>boolean</code> | Enable Powertools Lambda layer. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.enableTracing">enableTracing</a></code> | <code>boolean</code> | Enable X-Ray tracing. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.environmentVariables">environmentVariables</a></code> | <code>{[ key: string ]: string}</code> | Additional environment variables for the Lambda function. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.handler">handler</a></code> | <code>string</code> | Lambda handler. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.logRetentionDays">logRetentionDays</a></code> | <code>aws-cdk-lib.aws_logs.RetentionDays</code> | Log retention in days. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.memorySize">memorySize</a></code> | <code>number</code> | Memory in MB. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.reservedConcurrency">reservedConcurrency</a></code> | <code>number</code> | Reserved concurrent executions. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.runtime">runtime</a></code> | <code>aws-cdk-lib.aws_lambda.Runtime</code> | Lambda runtime. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.timeout">timeout</a></code> | <code>number</code> | Timeout in seconds. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | Existing VPC to use. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.vpcName">vpcName</a></code> | <code>string</code> | VPC name to look up. |
| <code><a href="#@yourorg/cdk-blueprints.EndpointFunctionProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Subnet selection override. |

---

##### `codePath`<sup>Required</sup> <a name="codePath" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.codePath"></a>

```typescript
public readonly codePath: string;
```

- *Type:* string

Path to the Lambda code directory or file.

---

##### `additionalPolicies`<sup>Optional</sup> <a name="additionalPolicies" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.additionalPolicies"></a>

```typescript
public readonly additionalPolicies: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

Additional IAM policies to attach to the function role.

---

##### `architecture`<sup>Optional</sup> <a name="architecture" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture

Architecture.

Default: ARM_64 (cost-effective)

---

##### `deployInVpc`<sup>Optional</sup> <a name="deployInVpc" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.deployInVpc"></a>

```typescript
public readonly deployInVpc: boolean;
```

- *Type:* boolean

Whether to deploy in VPC.

Default: false

---

##### `enablePowertools`<sup>Optional</sup> <a name="enablePowertools" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.enablePowertools"></a>

```typescript
public readonly enablePowertools: boolean;
```

- *Type:* boolean

Enable Powertools Lambda layer.

Default: true

---

##### `enableTracing`<sup>Optional</sup> <a name="enableTracing" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.enableTracing"></a>

```typescript
public readonly enableTracing: boolean;
```

- *Type:* boolean

Enable X-Ray tracing.

Default: true for staging/prod

---

##### `environmentVariables`<sup>Optional</sup> <a name="environmentVariables" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.environmentVariables"></a>

```typescript
public readonly environmentVariables: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Additional environment variables for the Lambda function.

---

##### `handler`<sup>Optional</sup> <a name="handler" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.handler"></a>

```typescript
public readonly handler: string;
```

- *Type:* string

Lambda handler.

Default: index.handler

---

##### `logRetentionDays`<sup>Optional</sup> <a name="logRetentionDays" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.logRetentionDays"></a>

```typescript
public readonly logRetentionDays: RetentionDays;
```

- *Type:* aws-cdk-lib.aws_logs.RetentionDays

Log retention in days.

---

##### `memorySize`<sup>Optional</sup> <a name="memorySize" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.memorySize"></a>

```typescript
public readonly memorySize: number;
```

- *Type:* number

Memory in MB.

Defaults based on environment.

---

##### `reservedConcurrency`<sup>Optional</sup> <a name="reservedConcurrency" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.reservedConcurrency"></a>

```typescript
public readonly reservedConcurrency: number;
```

- *Type:* number

Reserved concurrent executions.

Default: no reservation

---

##### `runtime`<sup>Optional</sup> <a name="runtime" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.runtime"></a>

```typescript
public readonly runtime: Runtime;
```

- *Type:* aws-cdk-lib.aws_lambda.Runtime

Lambda runtime.

Default: NODEJS_20_X

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.timeout"></a>

```typescript
public readonly timeout: number;
```

- *Type:* number

Timeout in seconds.

Defaults based on environment.

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

Existing VPC to use.

---

##### `vpcName`<sup>Optional</sup> <a name="vpcName" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.vpcName"></a>

```typescript
public readonly vpcName: string;
```

- *Type:* string

VPC name to look up.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="@yourorg/cdk-blueprints.EndpointFunctionProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

Subnet selection override.

---

### ScalingConfig <a name="ScalingConfig" id="@yourorg/cdk-blueprints.ScalingConfig"></a>

Standard scaling configuration.

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.ScalingConfig.Initializer"></a>

```typescript
import { ScalingConfig } from '@yourorg/cdk-blueprints'

const scalingConfig: ScalingConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.ScalingConfig.property.maxCapacity">maxCapacity</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.ScalingConfig.property.minCapacity">minCapacity</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.ScalingConfig.property.targetCpuUtilization">targetCpuUtilization</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@yourorg/cdk-blueprints.ScalingConfig.property.targetMemoryUtilization">targetMemoryUtilization</a></code> | <code>number</code> | *No description.* |

---

##### `maxCapacity`<sup>Required</sup> <a name="maxCapacity" id="@yourorg/cdk-blueprints.ScalingConfig.property.maxCapacity"></a>

```typescript
public readonly maxCapacity: number;
```

- *Type:* number

---

##### `minCapacity`<sup>Required</sup> <a name="minCapacity" id="@yourorg/cdk-blueprints.ScalingConfig.property.minCapacity"></a>

```typescript
public readonly minCapacity: number;
```

- *Type:* number

---

##### `targetCpuUtilization`<sup>Optional</sup> <a name="targetCpuUtilization" id="@yourorg/cdk-blueprints.ScalingConfig.property.targetCpuUtilization"></a>

```typescript
public readonly targetCpuUtilization: number;
```

- *Type:* number

---

##### `targetMemoryUtilization`<sup>Optional</sup> <a name="targetMemoryUtilization" id="@yourorg/cdk-blueprints.ScalingConfig.property.targetMemoryUtilization"></a>

```typescript
public readonly targetMemoryUtilization: number;
```

- *Type:* number

---

### StandardApiProps <a name="StandardApiProps" id="@yourorg/cdk-blueprints.StandardApiProps"></a>

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.StandardApiProps.Initializer"></a>

```typescript
import { StandardApiProps } from '@yourorg/cdk-blueprints'

const standardApiProps: StandardApiProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.environment">environment</a></code> | <code>string</code> | The deployment environment. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.serviceName">serviceName</a></code> | <code>string</code> | Service/application name. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.costCenter">costCenter</a></code> | <code>string</code> | Cost center for billing. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.team">team</a></code> | <code>string</code> | Team that owns this service. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.endpoints">endpoints</a></code> | <code><a href="#@yourorg/cdk-blueprints.ApiEndpoint">ApiEndpoint</a>[]</code> | API endpoints to create. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.burstLimit">burstLimit</a></code> | <code>number</code> | Throttling burst limit. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.corsOrigins">corsOrigins</a></code> | <code>string[]</code> | Allowed CORS origins. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.description">description</a></code> | <code>string</code> | API description. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.enableCors">enableCors</a></code> | <code>boolean</code> | Enable CORS. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.rateLimit">rateLimit</a></code> | <code>number</code> | Throttling rate limit (requests per second). |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.requireApiKey">requireApiKey</a></code> | <code>boolean</code> | Enable API key requirement. |
| <code><a href="#@yourorg/cdk-blueprints.StandardApiProps.property.stageName">stageName</a></code> | <code>string</code> | Deploy stage name. |

---

##### `environment`<sup>Required</sup> <a name="environment" id="@yourorg/cdk-blueprints.StandardApiProps.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

The deployment environment.

Affects scaling, redundancy, and other defaults.

---

##### `serviceName`<sup>Required</sup> <a name="serviceName" id="@yourorg/cdk-blueprints.StandardApiProps.property.serviceName"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* string

Service/application name.

Used for naming, tagging, and observability.

---

##### `costCenter`<sup>Optional</sup> <a name="costCenter" id="@yourorg/cdk-blueprints.StandardApiProps.property.costCenter"></a>

```typescript
public readonly costCenter: string;
```

- *Type:* string

Cost center for billing.

Used for tagging.

---

##### `team`<sup>Optional</sup> <a name="team" id="@yourorg/cdk-blueprints.StandardApiProps.property.team"></a>

```typescript
public readonly team: string;
```

- *Type:* string

Team that owns this service.

Used for tagging and cost allocation.

---

##### `endpoints`<sup>Required</sup> <a name="endpoints" id="@yourorg/cdk-blueprints.StandardApiProps.property.endpoints"></a>

```typescript
public readonly endpoints: ApiEndpoint[];
```

- *Type:* <a href="#@yourorg/cdk-blueprints.ApiEndpoint">ApiEndpoint</a>[]

API endpoints to create.

---

##### `burstLimit`<sup>Optional</sup> <a name="burstLimit" id="@yourorg/cdk-blueprints.StandardApiProps.property.burstLimit"></a>

```typescript
public readonly burstLimit: number;
```

- *Type:* number

Throttling burst limit.

Default: 2000

---

##### `corsOrigins`<sup>Optional</sup> <a name="corsOrigins" id="@yourorg/cdk-blueprints.StandardApiProps.property.corsOrigins"></a>

```typescript
public readonly corsOrigins: string[];
```

- *Type:* string[]

Allowed CORS origins.

Default: ['*'] for dev, restricted for prod

---

##### `description`<sup>Optional</sup> <a name="description" id="@yourorg/cdk-blueprints.StandardApiProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

API description.

---

##### `enableCors`<sup>Optional</sup> <a name="enableCors" id="@yourorg/cdk-blueprints.StandardApiProps.property.enableCors"></a>

```typescript
public readonly enableCors: boolean;
```

- *Type:* boolean

Enable CORS.

Default: true

---

##### `rateLimit`<sup>Optional</sup> <a name="rateLimit" id="@yourorg/cdk-blueprints.StandardApiProps.property.rateLimit"></a>

```typescript
public readonly rateLimit: number;
```

- *Type:* number

Throttling rate limit (requests per second).

Default: 1000

---

##### `requireApiKey`<sup>Optional</sup> <a name="requireApiKey" id="@yourorg/cdk-blueprints.StandardApiProps.property.requireApiKey"></a>

```typescript
public readonly requireApiKey: boolean;
```

- *Type:* boolean

Enable API key requirement.

Default: false

---

##### `stageName`<sup>Optional</sup> <a name="stageName" id="@yourorg/cdk-blueprints.StandardApiProps.property.stageName"></a>

```typescript
public readonly stageName: string;
```

- *Type:* string

Deploy stage name.

Default: matches environment

---

### StandardFargateServiceProps <a name="StandardFargateServiceProps" id="@yourorg/cdk-blueprints.StandardFargateServiceProps"></a>

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.Initializer"></a>

```typescript
import { StandardFargateServiceProps } from '@yourorg/cdk-blueprints'

const standardFargateServiceProps: StandardFargateServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.environment">environment</a></code> | <code>string</code> | The deployment environment. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.serviceName">serviceName</a></code> | <code>string</code> | Service/application name. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.costCenter">costCenter</a></code> | <code>string</code> | Cost center for billing. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.team">team</a></code> | <code>string</code> | Team that owns this service. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | Existing VPC to use. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.vpcName">vpcName</a></code> | <code>string</code> | VPC name to look up (if vpc not provided). |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Subnet selection override. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.image">image</a></code> | <code>string</code> | Container image URI (ECR or public registry). |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.cluster">cluster</a></code> | <code>aws-cdk-lib.aws_ecs.ICluster</code> | Existing ECS cluster to use. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.containerEnv">containerEnv</a></code> | <code>{[ key: string ]: string}</code> | Environment variables for the container. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.containerPort">containerPort</a></code> | <code>number</code> | Container port. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.cpu">cpu</a></code> | <code>number</code> | CPU units. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.enableExecuteCommand">enableExecuteCommand</a></code> | <code>boolean</code> | Enable ECS Exec for debugging. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.healthCheckPath">healthCheckPath</a></code> | <code>string</code> | Health check path. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.logRetentionDays">logRetentionDays</a></code> | <code>number</code> | Log retention in days. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.maxCapacity">maxCapacity</a></code> | <code>number</code> | Maximum number of tasks. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.memoryMiB">memoryMiB</a></code> | <code>number</code> | Memory in MiB. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.minCapacity">minCapacity</a></code> | <code>number</code> | Minimum number of tasks. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.publicLoadBalancer">publicLoadBalancer</a></code> | <code>boolean</code> | Make the ALB internet-facing. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.targetCpuUtilization">targetCpuUtilization</a></code> | <code>number</code> | Target CPU utilization percentage for scaling. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFargateServiceProps.property.targetMemoryUtilization">targetMemoryUtilization</a></code> | <code>number</code> | Target memory utilization percentage for scaling. |

---

##### `environment`<sup>Required</sup> <a name="environment" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

The deployment environment.

Affects scaling, redundancy, and other defaults.

---

##### `serviceName`<sup>Required</sup> <a name="serviceName" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.serviceName"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* string

Service/application name.

Used for naming, tagging, and observability.

---

##### `costCenter`<sup>Optional</sup> <a name="costCenter" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.costCenter"></a>

```typescript
public readonly costCenter: string;
```

- *Type:* string

Cost center for billing.

Used for tagging.

---

##### `team`<sup>Optional</sup> <a name="team" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.team"></a>

```typescript
public readonly team: string;
```

- *Type:* string

Team that owns this service.

Used for tagging and cost allocation.

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

Existing VPC to use.

If not provided, auto-discovers first non-default VPC.

---

##### `vpcName`<sup>Optional</sup> <a name="vpcName" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.vpcName"></a>

```typescript
public readonly vpcName: string;
```

- *Type:* string

VPC name to look up (if vpc not provided).

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

Subnet selection override.

Defaults to private subnets with egress.

---

##### `image`<sup>Required</sup> <a name="image" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.image"></a>

```typescript
public readonly image: string;
```

- *Type:* string

Container image URI (ECR or public registry).

---

##### `cluster`<sup>Optional</sup> <a name="cluster" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.cluster"></a>

```typescript
public readonly cluster: ICluster;
```

- *Type:* aws-cdk-lib.aws_ecs.ICluster

Existing ECS cluster to use.

If not provided, creates a new one.

---

##### `containerEnv`<sup>Optional</sup> <a name="containerEnv" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.containerEnv"></a>

```typescript
public readonly containerEnv: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Environment variables for the container.

---

##### `containerPort`<sup>Optional</sup> <a name="containerPort" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.containerPort"></a>

```typescript
public readonly containerPort: number;
```

- *Type:* number

Container port.

Default: 8080

---

##### `cpu`<sup>Optional</sup> <a name="cpu" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.cpu"></a>

```typescript
public readonly cpu: number;
```

- *Type:* number

CPU units.

Default: 256 (0.25 vCPU)

---

##### `enableExecuteCommand`<sup>Optional</sup> <a name="enableExecuteCommand" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.enableExecuteCommand"></a>

```typescript
public readonly enableExecuteCommand: boolean;
```

- *Type:* boolean

Enable ECS Exec for debugging.

Default: true in dev, false otherwise

---

##### `healthCheckPath`<sup>Optional</sup> <a name="healthCheckPath" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.healthCheckPath"></a>

```typescript
public readonly healthCheckPath: string;
```

- *Type:* string

Health check path.

Default: /health

---

##### `logRetentionDays`<sup>Optional</sup> <a name="logRetentionDays" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.logRetentionDays"></a>

```typescript
public readonly logRetentionDays: number;
```

- *Type:* number

Log retention in days.

Default: 30 (dev), 90 (staging), 365 (prod)

---

##### `maxCapacity`<sup>Optional</sup> <a name="maxCapacity" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.maxCapacity"></a>

```typescript
public readonly maxCapacity: number;
```

- *Type:* number

Maximum number of tasks.

Overrides environment default.

---

##### `memoryMiB`<sup>Optional</sup> <a name="memoryMiB" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.memoryMiB"></a>

```typescript
public readonly memoryMiB: number;
```

- *Type:* number

Memory in MiB.

Default: 512

---

##### `minCapacity`<sup>Optional</sup> <a name="minCapacity" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.minCapacity"></a>

```typescript
public readonly minCapacity: number;
```

- *Type:* number

Minimum number of tasks.

Overrides environment default.

---

##### `publicLoadBalancer`<sup>Optional</sup> <a name="publicLoadBalancer" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.publicLoadBalancer"></a>

```typescript
public readonly publicLoadBalancer: boolean;
```

- *Type:* boolean

Make the ALB internet-facing.

Default: false (internal)

---

##### `targetCpuUtilization`<sup>Optional</sup> <a name="targetCpuUtilization" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.targetCpuUtilization"></a>

```typescript
public readonly targetCpuUtilization: number;
```

- *Type:* number

Target CPU utilization percentage for scaling.

Overrides environment default.

---

##### `targetMemoryUtilization`<sup>Optional</sup> <a name="targetMemoryUtilization" id="@yourorg/cdk-blueprints.StandardFargateServiceProps.property.targetMemoryUtilization"></a>

```typescript
public readonly targetMemoryUtilization: number;
```

- *Type:* number

Target memory utilization percentage for scaling.

---

### StandardFunctionProps <a name="StandardFunctionProps" id="@yourorg/cdk-blueprints.StandardFunctionProps"></a>

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.StandardFunctionProps.Initializer"></a>

```typescript
import { StandardFunctionProps } from '@yourorg/cdk-blueprints'

const standardFunctionProps: StandardFunctionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.environment">environment</a></code> | <code>string</code> | The deployment environment. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.serviceName">serviceName</a></code> | <code>string</code> | Service/application name. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.costCenter">costCenter</a></code> | <code>string</code> | Cost center for billing. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.team">team</a></code> | <code>string</code> | Team that owns this service. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | Existing VPC to use. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.vpcName">vpcName</a></code> | <code>string</code> | VPC name to look up (if vpc not provided). |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Subnet selection override. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.codePath">codePath</a></code> | <code>string</code> | Path to the Lambda code directory or file. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.additionalPolicies">additionalPolicies</a></code> | <code>aws-cdk-lib.aws_iam.PolicyStatement[]</code> | Additional IAM policies to attach to the function role. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | Architecture. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.deployInVpc">deployInVpc</a></code> | <code>boolean</code> | Whether to deploy in VPC. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.enablePowertools">enablePowertools</a></code> | <code>boolean</code> | Enable Powertools Lambda layer. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.enableTracing">enableTracing</a></code> | <code>boolean</code> | Enable X-Ray tracing. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.environmentVariables">environmentVariables</a></code> | <code>{[ key: string ]: string}</code> | Additional environment variables for the Lambda function. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.handler">handler</a></code> | <code>string</code> | Lambda handler. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.logRetentionDays">logRetentionDays</a></code> | <code>aws-cdk-lib.aws_logs.RetentionDays</code> | Log retention in days. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.memorySize">memorySize</a></code> | <code>number</code> | Memory in MB. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.reservedConcurrency">reservedConcurrency</a></code> | <code>number</code> | Reserved concurrent executions. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.runtime">runtime</a></code> | <code>aws-cdk-lib.aws_lambda.Runtime</code> | Lambda runtime. |
| <code><a href="#@yourorg/cdk-blueprints.StandardFunctionProps.property.timeout">timeout</a></code> | <code>number</code> | Timeout in seconds. |

---

##### `environment`<sup>Required</sup> <a name="environment" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

The deployment environment.

Affects scaling, redundancy, and other defaults.

---

##### `serviceName`<sup>Required</sup> <a name="serviceName" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.serviceName"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* string

Service/application name.

Used for naming, tagging, and observability.

---

##### `costCenter`<sup>Optional</sup> <a name="costCenter" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.costCenter"></a>

```typescript
public readonly costCenter: string;
```

- *Type:* string

Cost center for billing.

Used for tagging.

---

##### `team`<sup>Optional</sup> <a name="team" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.team"></a>

```typescript
public readonly team: string;
```

- *Type:* string

Team that owns this service.

Used for tagging and cost allocation.

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

Existing VPC to use.

If not provided, auto-discovers first non-default VPC.

---

##### `vpcName`<sup>Optional</sup> <a name="vpcName" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.vpcName"></a>

```typescript
public readonly vpcName: string;
```

- *Type:* string

VPC name to look up (if vpc not provided).

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

Subnet selection override.

Defaults to private subnets with egress.

---

##### `codePath`<sup>Required</sup> <a name="codePath" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.codePath"></a>

```typescript
public readonly codePath: string;
```

- *Type:* string

Path to the Lambda code directory or file.

---

##### `additionalPolicies`<sup>Optional</sup> <a name="additionalPolicies" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.additionalPolicies"></a>

```typescript
public readonly additionalPolicies: PolicyStatement[];
```

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement[]

Additional IAM policies to attach to the function role.

---

##### `architecture`<sup>Optional</sup> <a name="architecture" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture

Architecture.

Default: ARM_64 (cost-effective)

---

##### `deployInVpc`<sup>Optional</sup> <a name="deployInVpc" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.deployInVpc"></a>

```typescript
public readonly deployInVpc: boolean;
```

- *Type:* boolean

Whether to deploy in VPC.

Default: false

---

##### `enablePowertools`<sup>Optional</sup> <a name="enablePowertools" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.enablePowertools"></a>

```typescript
public readonly enablePowertools: boolean;
```

- *Type:* boolean

Enable Powertools Lambda layer.

Default: true

---

##### `enableTracing`<sup>Optional</sup> <a name="enableTracing" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.enableTracing"></a>

```typescript
public readonly enableTracing: boolean;
```

- *Type:* boolean

Enable X-Ray tracing.

Default: true for staging/prod

---

##### `environmentVariables`<sup>Optional</sup> <a name="environmentVariables" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.environmentVariables"></a>

```typescript
public readonly environmentVariables: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Additional environment variables for the Lambda function.

---

##### `handler`<sup>Optional</sup> <a name="handler" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.handler"></a>

```typescript
public readonly handler: string;
```

- *Type:* string

Lambda handler.

Default: index.handler

---

##### `logRetentionDays`<sup>Optional</sup> <a name="logRetentionDays" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.logRetentionDays"></a>

```typescript
public readonly logRetentionDays: RetentionDays;
```

- *Type:* aws-cdk-lib.aws_logs.RetentionDays

Log retention in days.

---

##### `memorySize`<sup>Optional</sup> <a name="memorySize" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.memorySize"></a>

```typescript
public readonly memorySize: number;
```

- *Type:* number

Memory in MB.

Defaults based on environment.

---

##### `reservedConcurrency`<sup>Optional</sup> <a name="reservedConcurrency" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.reservedConcurrency"></a>

```typescript
public readonly reservedConcurrency: number;
```

- *Type:* number

Reserved concurrent executions.

Default: no reservation

---

##### `runtime`<sup>Optional</sup> <a name="runtime" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.runtime"></a>

```typescript
public readonly runtime: Runtime;
```

- *Type:* aws-cdk-lib.aws_lambda.Runtime

Lambda runtime.

Default: NODEJS_20_X

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="@yourorg/cdk-blueprints.StandardFunctionProps.property.timeout"></a>

```typescript
public readonly timeout: number;
```

- *Type:* number

Timeout in seconds.

Defaults based on environment.

---

### VpcDiscoveryProps <a name="VpcDiscoveryProps" id="@yourorg/cdk-blueprints.VpcDiscoveryProps"></a>

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.VpcDiscoveryProps.Initializer"></a>

```typescript
import { VpcDiscoveryProps } from '@yourorg/cdk-blueprints'

const vpcDiscoveryProps: VpcDiscoveryProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscoveryProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Tags to filter VPCs by. |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscoveryProps.property.vpcId">vpcId</a></code> | <code>string</code> | Specific VPC ID to look up. |
| <code><a href="#@yourorg/cdk-blueprints.VpcDiscoveryProps.property.vpcName">vpcName</a></code> | <code>string</code> | Specific VPC name to look up. |

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@yourorg/cdk-blueprints.VpcDiscoveryProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Tags to filter VPCs by.

---

##### `vpcId`<sup>Optional</sup> <a name="vpcId" id="@yourorg/cdk-blueprints.VpcDiscoveryProps.property.vpcId"></a>

```typescript
public readonly vpcId: string;
```

- *Type:* string

Specific VPC ID to look up.

---

##### `vpcName`<sup>Optional</sup> <a name="vpcName" id="@yourorg/cdk-blueprints.VpcDiscoveryProps.property.vpcName"></a>

```typescript
public readonly vpcName: string;
```

- *Type:* string

Specific VPC name to look up.

If not provided, discovers first non-default VPC.

---

### VpcProps <a name="VpcProps" id="@yourorg/cdk-blueprints.VpcProps"></a>

Props for constructs that need VPC configuration.

#### Initializer <a name="Initializer" id="@yourorg/cdk-blueprints.VpcProps.Initializer"></a>

```typescript
import { VpcProps } from '@yourorg/cdk-blueprints'

const vpcProps: VpcProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yourorg/cdk-blueprints.VpcProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | Existing VPC to use. |
| <code><a href="#@yourorg/cdk-blueprints.VpcProps.property.vpcName">vpcName</a></code> | <code>string</code> | VPC name to look up (if vpc not provided). |
| <code><a href="#@yourorg/cdk-blueprints.VpcProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Subnet selection override. |

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="@yourorg/cdk-blueprints.VpcProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

Existing VPC to use.

If not provided, auto-discovers first non-default VPC.

---

##### `vpcName`<sup>Optional</sup> <a name="vpcName" id="@yourorg/cdk-blueprints.VpcProps.property.vpcName"></a>

```typescript
public readonly vpcName: string;
```

- *Type:* string

VPC name to look up (if vpc not provided).

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="@yourorg/cdk-blueprints.VpcProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection

Subnet selection override.

Defaults to private subnets with egress.

---



