import * as ec2 from "aws-cdk-lib/aws-ec2";

/**
 * Standard environment tiers used across blueprints.
 */
export type Environment = "dev" | "staging" | "prod";

/**
 * Common configuration for all blueprint constructs.
 */
export interface BlueprintBaseProps {
  /**
   * The deployment environment. Affects scaling, redundancy, and other defaults.
   */
  readonly environment: Environment;

  /**
   * Service/application name. Used for naming, tagging, and observability.
   */
  readonly serviceName: string;

  /**
   * Team that owns this service. Used for tagging and cost allocation.
   */
  readonly team?: string;

  /**
   * Cost center for billing. Used for tagging.
   */
  readonly costCenter?: string;
}

/**
 * Props for constructs that need VPC configuration.
 */
export interface VpcProps {
  /**
   * Existing VPC to use. If not provided, auto-discovers first non-default VPC.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * VPC name to look up (if vpc not provided).
   */
  readonly vpcName?: string;

  /**
   * Subnet selection override. Defaults to private subnets with egress.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;
}

/**
 * Standard scaling configuration.
 */
export interface ScalingConfig {
  readonly minCapacity: number;
  readonly maxCapacity: number;
  readonly targetCpuUtilization?: number;
  readonly targetMemoryUtilization?: number;
}

/**
 * Environment-based defaults for scaling.
 */
export const SCALING_DEFAULTS: Record<Environment, ScalingConfig> = {
  dev: {
    minCapacity: 1,
    maxCapacity: 2,
    targetCpuUtilization: 80,
  },
  staging: {
    minCapacity: 2,
    maxCapacity: 4,
    targetCpuUtilization: 75,
  },
  prod: {
    minCapacity: 3,
    maxCapacity: 20,
    targetCpuUtilization: 70,
  },
};

/**
 * Standard alarm thresholds by environment.
 */
export const ALARM_THRESHOLDS: Record<
  Environment,
  { errorRatePercent: number; latencyMs: number }
> = {
  dev: { errorRatePercent: 10, latencyMs: 2000 },
  staging: { errorRatePercent: 5, latencyMs: 1000 },
  prod: { errorRatePercent: 1, latencyMs: 500 },
};
