import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export interface VpcDiscoveryProps {
  /**
   * Specific VPC name to look up. If not provided, discovers first non-default VPC.
   */
  readonly vpcName?: string;

  /**
   * Specific VPC ID to look up.
   */
  readonly vpcId?: string;

  /**
   * Tags to filter VPCs by.
   */
  readonly tags?: Record<string, string>;
}

/**
 * Zero-config VPC discovery that excludes default VPC.
 *
 * @example
 * const { vpc, privateSubnets } = new VpcDiscovery(this, 'Vpc');
 *
 * new ec2.Instance(this, 'Instance', {
 *   vpc,
 *   vpcSubnets: privateSubnets,
 *   // ...
 * });
 */
export class VpcDiscovery extends Construct {
  /** The discovered VPC */
  readonly vpc: ec2.IVpc;

  /** Subnet selection for public subnets */
  readonly publicSubnets: ec2.SubnetSelection = {
    subnetType: ec2.SubnetType.PUBLIC,
  };

  /** Subnet selection for private subnets with egress (NAT) */
  readonly privateSubnets: ec2.SubnetSelection = {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  };

  /** Subnet selection for isolated subnets (no internet) */
  readonly isolatedSubnets: ec2.SubnetSelection = {
    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
  };

  constructor(scope: Construct, id: string, props: VpcDiscoveryProps = {}) {
    super(scope, id);

    this.vpc = ec2.Vpc.fromLookup(this, "Vpc", {
      isDefault: false,
      ...(props.vpcId && { vpcId: props.vpcId }),
      ...(props.vpcName && { vpcName: props.vpcName }),
      ...(props.tags && { tags: props.tags }),
    });
  }
}
