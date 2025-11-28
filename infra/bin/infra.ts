#!/usr/bin/env node
/* eslint-disable no-undef */
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { DatabaseStack } from '../lib/database-stack';
import { AuthStack } from '../lib/auth-stack';
import { ComputeStack } from '../lib/compute-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();
// eslint-disable-next-line turbo/no-undeclared-env-vars
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const network = new NetworkStack(app, 'DevGuard-Network', { env });

const database = new DatabaseStack(app, 'DevGuard-Database', {
  env,
  vpc: network.vpc,
  dbSecurityGroup: network.dbSecurityGroup,
});

const auth = new AuthStack(app, 'DevGuard-Auth', { env });

// eslint-disable-next-line no-unused-vars
const compute = new ComputeStack(app, 'DevGuard-Compute', {
  env,
  vpc: network.vpc,
  dbInstance: database.dbInstance,
  dbSecret: database.dbSecret,
  userPoolId: auth.userPool.userPoolId,
  userPoolClientId: auth.userPoolClient.userPoolClientId,
  enableApiGateway: false,
  // domainName: 'your-domain.com',
  // certificateArn: 'arn:aws:acm:region:account:certificate/id',
});

new FrontendStack(app, 'DevGuard-Dashboard', { env });
