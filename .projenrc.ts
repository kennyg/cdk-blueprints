import { awscdk, javascript } from "projen";

const project = new awscdk.AwsCdkConstructLibrary({
  packageManager: javascript.NodePackageManager.NPM,
  name: "@yourorg/cdk-blueprints",
  description:
    "Opinionated CDK constructs with organizational best practices baked in",
  author: "Platform Team",
  authorAddress: "platform-team@yourorg.com",
  repositoryUrl: "https://github.com/yourorg/cdk-blueprints",

  cdkVersion: "2.150.0",
  constructsVersion: "10.3.0",
  jsiiVersion: "~5.7.0",
  defaultReleaseBranch: "main",
  projenrcTs: true,

  // Peer dependencies - consumers must have these
  peerDeps: ["aws-cdk-lib@^2.150.0", "constructs@^10.3.0"],

  // Dev dependencies for testing/building
  devDeps: [
    "aws-cdk-lib@2.150.0",
    "constructs@10.3.0",
    "ts-node@^10",
    "@types/glob",
  ],

  // Publishing to CodeArtifact (adjust for your registry)
  // npmRegistryUrl: 'https://your-domain.d.codeartifact.us-east-1.amazonaws.com/npm/your-repo/',

  // Or disable publishing entirely for monorepo usage
  // release: false,

  // Generate API docs
  docgen: true,

  // Stricter settings
  prettier: true,
  eslint: true,
  jest: true,
  jestOptions: {
    jestConfig: {
      testPathIgnorePatterns: ["/node_modules/"],
    },
  },

  // GitHub Actions workflows
  githubOptions: {
    mergify: false,
  },

  // Metadata
  keywords: [
    "aws",
    "cdk",
    "constructs",
    "blueprints",
    "ecs",
    "lambda",
    "fargate",
  ],
});

// Add useful scripts
project.addTask("integ", {
  description: "Run integration tests",
  exec: 'cdk synth --app "npx ts-node test/integ.ts"',
});

project.synth();
