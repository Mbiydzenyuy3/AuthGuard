import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
// import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cloudwatch_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as events from 'aws-cdk-lib/aws-events';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
// import * as targets from 'aws-cdk-lib/aws-events-targets';

interface ComputeStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  dbInstance: rds.DatabaseInstance;
  dbSecret: secretsmanager.Secret;
  userPoolId: string;
  userPoolClientId: string;
  domainName?: string;
  certificateArn?: string;
  enableApiGateway?: boolean;
}

export class ComputeStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    const {
      vpc,
      dbInstance,
      dbSecret,
      userPoolId,
      userPoolClientId,
      // domainName,
      // certificateArn,
      enableApiGateway = true,
    } = props;

    const cluster = new ecs.Cluster(this, 'DevGuardCluster', { vpc });

    const ecsSecurityGroup = new ec2.SecurityGroup(this, 'DevGuardECSSecurityGroup', {
      vpc,
      description: 'Security group for ECS tasks',
      allowAllOutbound: true,
    });

    ecsSecurityGroup.addIngressRule(
      ec2.Peer.ipv4('0.0.0.0/0'),
      ec2.Port.tcp(3000),
      'HTTP access from anywhere (restrict to specific IPs in production)',
    );

    ecsSecurityGroup.addIngressRule(
      dbInstance.connections.securityGroups[0],
      ec2.Port.tcp(5432),
      'Allow ECS to connect to RDS',
    );

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'ApiTaskDef', {
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole: new iam.Role(this, 'ApiTaskDefExecutionRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AmazonECSTaskExecutionRolePolicy',
          ),
        ],
      }),
      taskRole: new iam.Role(this, 'ApiTaskDefTaskRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      }),
    });

    taskDefinition.executionRole?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess'),
    );

    taskDefinition.executionRole?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
    );

    dbSecret.grantRead(taskDefinition.taskRole!);

    // eslint-disable-next-line no-unused-vars
    const container = taskDefinition.addContainer('ApiContainer', {
      image: ecs.ContainerImage.fromRegistry(
        '738095763532.dkr.ecr.us-east-1.amazonaws.com/devguard-api:latest',
      ),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'api',
        logRetention: logs.RetentionDays.ONE_WEEK,
      }),
      environment: {
        NODE_ENV: 'production',
        AWS_COGNITO_USER_POOL_ID: userPoolId,
        AWS_COGNITO_CLIENT_ID: userPoolClientId,
        AWS_REGION: cdk.Aws.REGION,
        DATABASE_HOST: dbInstance.dbInstanceEndpointAddress,
        DATABASE_PORT: dbInstance.dbInstanceEndpointPort,
        DATABASE_NAME: 'DevGuard',
        PORT: '3000',
      },
      secrets: {
        DB_SECRET: ecs.Secret.fromSecretsManager(dbSecret),
      },
      portMappings: [
        {
          containerPort: 3000,
          protocol: ecs.Protocol.TCP,
        },
      ],
    });

    const service = new ecs.FargateService(this, 'ApiService', {
      cluster,
      taskDefinition,
      desiredCount: 2,
      assignPublicIp: true,
      securityGroups: [ecsSecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    const scaling = service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 4,
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
    });

    if (enableApiGateway) {
      const nlb = new elbv2.NetworkLoadBalancer(this, 'DevGuardNLB', {
        vpc,
        internetFacing: true,
        securityGroups: [ecsSecurityGroup],
      });

      const targetGroup = new elbv2.NetworkTargetGroup(this, 'DevGuardTargetGroup', {
        vpc,
        port: 3000,
        targets: [service],
        healthCheck: {
          path: '/health',
          interval: cdk.Duration.seconds(60),
          timeout: cdk.Duration.seconds(30),
          healthyThresholdCount: 2,
          unhealthyThresholdCount: 3,
        },
      });

      nlb.addListener('DevGuardListener', {
        port: 80,
        defaultTargetGroups: [targetGroup],
      });

      const api = new apigateway.RestApi(this, 'DevGuardApi', {
        restApiName: 'DevGuard API',
        description: 'API Gateway for DevGuard Application',
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: apigateway.Cors.ALL_METHODS,
        },
      });

      const vpcLink = new apigateway.VpcLink(this, 'DevGuardVpcLink', {
        targets: [nlb],
      });

      const integration = new apigateway.Integration({
        type: apigateway.IntegrationType.HTTP_PROXY,
        integrationHttpMethod: 'ANY',
        uri: `http://${nlb.loadBalancerDnsName}/{proxy}`,
        options: {
          connectionType: apigateway.ConnectionType.VPC_LINK,
          vpcLink: vpcLink,
        },
      });

      const proxyResource = api.root.addResource('{proxy+}');
      proxyResource.addMethod('ANY', integration);

      api.root.addMethod('GET', integration);
      api.root.addMethod('POST', integration);
      api.root.addMethod('PUT', integration);
      api.root.addMethod('DELETE', integration);

      this.apiUrl = api.url;
    } else {
      this.apiUrl = `Direct ECS Access - Service: ${service.serviceName}`;
    }

    const alarmTopic = new sns.Topic(this, 'DevGuardAlarmTopic', {
      displayName: 'DevGuard Application Alarms',
    });

    const cpuAlarm = new cloudwatch.Alarm(this, 'ECSCpuUtilizationAlarm', {
      metric: service.metricCpuUtilization(),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Alarm when ECS service CPU utilization exceeds 80%',
    });

    cpuAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    const memoryAlarm = new cloudwatch.Alarm(this, 'ECSMemoryUtilizationAlarm', {
      metric: service.metricMemoryUtilization(),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: 'Alarm when ECS service memory utilization exceeds 80%',
    });

    memoryAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));

    // eslint-disable-next-line no-unused-vars
    const healthCheckRule = new events.Rule(this, 'ECSHealthCheckRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.apiUrl,
      description: 'Direct ECS access URL',
      exportName: 'DevGuardApiUrl',
    });

    new cdk.CfnOutput(this, 'ECSServiceName', {
      value: service.serviceName,
      description: 'Name of the ECS Service for monitoring',
      exportName: 'DevGuardECSServiceName',
    });

    new cdk.CfnOutput(this, 'SecurityAlarmTopicArn', {
      value: alarmTopic.topicArn,
      description: 'SNS Topic ARN for security and performance alerts',
      exportName: 'DevGuardAlarmTopicArn',
    });
  }
}
