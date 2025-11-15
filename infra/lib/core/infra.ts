#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { BaseStack } from '../lib/core/base-stack';

const app = new App();

new BaseStack(app, 'AuthGuardBaseStack', {
  env: {
    region: 'eu-north-1',
  },
});
