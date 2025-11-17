#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { DataStack } from '../lib/data-stack';
import { AuthStack } from '../lib/auth-stack';
import { ComputeStack } from '../lib/compute-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const network = new NetworkStack(app, 'DevGuard-Network', { env });
const data = new DataStack(app, 'DevGuard-Data', { env, vpc: network.vpc });
const auth = new AuthStack(app, 'DevGuard-Auth', { env });

// eslint-disable-next-line no-unused-vars
const compute = new ComputeStack(app, 'DevGuard-Compute', {
  env,
  vpc: network.vpc,
  dbSecret: data.dbSecret,
  userPoolId: auth.userPool.userPoolId,
  userPoolClientId: auth.userPoolClient.userPoolClientId,
});

new FrontendStack(app, 'DevGuard-Frontend', { env });
