import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface DatabaseStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  dbSecurityGroup: ec2.ISecurityGroup;
}

export class DatabaseStack extends cdk.Stack {
  public readonly dbInstance: rds.DatabaseInstance;
  public readonly dbSecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { vpc, dbSecurityGroup } = props;

    this.dbInstance = new rds.DatabaseInstance(this, 'DevGuardPostgres', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [dbSecurityGroup],
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      allocatedStorage: 20,
      storageType: rds.StorageType.GP2,

      databaseName: 'DevGuard',
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publiclyAccessible: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(1),
      deleteAutomatedBackups: true,
    });

    if (!this.dbInstance.secret) throw new Error('Database instance did not generate a secret');
    this.dbSecret = this.dbInstance.secret as secretsmanager.Secret;

    new cdk.CfnOutput(this, 'DatabaseSecretArn', { value: this.dbSecret.secretArn });
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.dbInstance.dbInstanceEndpointAddress,
    });
    new cdk.CfnOutput(this, 'DatabasePort', { value: this.dbInstance.dbInstanceEndpointPort });
  }
}
