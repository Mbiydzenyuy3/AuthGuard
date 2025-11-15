#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';
// import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();

const backend = new BackendStack(app, 'BackendStack', {
  env: { region: 'eu-north-1' },
});

// new FrontendStack(app, 'FrontendStack', {
//   apiUrl: backend.apiUrl.value,
//   env: { region: 'eu-north-1' },
// });
