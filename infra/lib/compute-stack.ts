import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as path from 'path';
import { Construct } from 'constructs';

interface ComputeStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  dbSecret: secretsmanager.ISecret;
  userPoolId: string;
  userPoolClientId: string;
}

export class ComputeStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    const { vpc, dbSecret, userPoolId, userPoolClientId } = props;

    const cluster = new ecs.Cluster(this, 'DevGuardCluster', { vpc });

    // eslint-disable-next-line no-undef
    const rootAssetPath = path.join(__dirname, '..', '..');

    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ApiService', {
      cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 1,
      publicLoadBalancer: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(rootAssetPath, {
          file: 'Dockerfile',
          ignoreMode: cdk.IgnoreMode.DOCKER,
          exclude: ['**/node_modules', '**/cdk.out', 'infra/cdk.out', '.git', '.turbo'],
        }),
        containerPort: 3000,
        secrets: {
          DB_SECRET: ecs.Secret.fromSecretsManager(dbSecret),
        },
        environment: {
          NODE_ENV: 'production',
          AWS_COGNITO_USER_POOL_ID: userPoolId,
          AWS_COGNITO_CLIENT_ID: userPoolClientId,
          AWS_REGION: cdk.Aws.REGION,
        },
      },
    });

    dbSecret.grantRead(service.taskDefinition.taskRole);

    service.targetGroup.configureHealthCheck({ path: '/health' });

    this.apiUrl = `http://${service.loadBalancer.loadBalancerDnsName}`;
    new cdk.CfnOutput(this, 'ApiUrl', { value: this.apiUrl });
  }
}
