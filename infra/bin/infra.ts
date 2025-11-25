#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { DatabaseStack } from '../lib/database-stack';
import { AuthStack } from '../lib/auth-stack';
import { ComputeStack } from '../lib/compute-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const network = new NetworkStack(app, 'DevGuard-Network', { env });
const database = new DatabaseStack(app, 'DevGuard-Data', { env, vpc: network.vpc });
const auth = new AuthStack(app, 'DevGuard-Auth', { env });

// eslint-disable-next-line no-unused-vars
const compute = new ComputeStack(app, 'DevGuard-Compute-v2', {
  env,
  vpc: network.vpc,
  dbSecret: database.dbSecret,
  userPoolId: auth.userPool.userPoolId,
  userPoolClientId: auth.userPoolClient.userPoolClientId,
});

new FrontendStack(app, 'DevGuard-Frontend', { env });
