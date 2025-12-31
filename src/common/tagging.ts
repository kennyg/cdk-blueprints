import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { BlueprintBaseProps } from "./types";

/**
 * Applies standard organizational tags to a construct and all its children.
 */
export function applyStandardTags(
  scope: Construct,
  props: BlueprintBaseProps,
  additionalTags?: Record<string, string>,
): void {
  const tags = cdk.Tags.of(scope);

  // Required tags
  tags.add("Service", props.serviceName);
  tags.add("Environment", props.environment);
  tags.add("ManagedBy", "cdk-blueprints");

  // Optional tags
  if (props.team) {
    tags.add("Team", props.team);
  }
  if (props.costCenter) {
    tags.add("CostCenter", props.costCenter);
  }

  // Additional custom tags
  if (additionalTags) {
    Object.entries(additionalTags).forEach(([key, value]) => {
      tags.add(key, value);
    });
  }
}

/**
 * Generates a standard resource name with environment prefix.
 */
export function resourceName(
  serviceName: string,
  environment: string,
  suffix?: string,
): string {
  const parts = [serviceName, environment];
  if (suffix) {
    parts.push(suffix);
  }
  return parts.join("-");
}
