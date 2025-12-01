import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import * as path from 'path';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

interface DocumentationStackProps extends cdk.StackProps {
  docsRootPath: string;
  vpc?: ec2.IVpc;
  enableCloudFront?: boolean;
}

export class DocumentationStack extends cdk.Stack {
  public readonly docsBucket: s3.Bucket;
  public readonly distribution?: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: DocumentationStackProps) {
    super(scope, id, props);

    const { docsRootPath, vpc, enableCloudFront = false } = props;

    this.docsBucket = new s3.Bucket(this, 'DocumentationBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      lifecycleRules: [
        {
          id: 'deleteOldVersions',
          enabled: true,
          noncurrentVersionExpiration: cdk.Duration.days(30),
        },
        {
          id: 'intelligentTiering',
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(0),
            },
          ],
        },
      ],
    });

    if (vpc) {
      new ec2.GatewayVpcEndpoint(this, 'S3VpcEndpoint', {
        vpc,
        service: ec2.GatewayVpcEndpointAwsService.S3,
        subnets: [
          {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          },
        ],
      });
    }

    if (enableCloudFront) {
      this.distribution = new cloudfront.Distribution(this, 'DocumentationDistro', {
        defaultBehavior: {
          origin: new origins.S3Origin(this.docsBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: 'index.html',
        errorResponses: [
          {
            httpStatus: 404,
            responsePagePath: '/index.html',
            responseHttpStatus: 200,
          },
        ],
      });

      const distributionARN = `arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`;
      new s3.CfnBucketPolicy(this, 'CloudFrontBucketPolicy', {
        bucket: this.docsBucket.bucketName,
        policyDocument: {
          Statement: [
            {
              Sid: 'AllowCloudFrontServicePrincipalReadOnly',
              Effect: 'Allow',
              Principal: {
                Service: 'cloudfront.amazonaws.com',
              },
              Action: 's3:GetObject',
              Resource: `${this.docsBucket.bucketArn}/*`,
              Condition: {
                StringEquals: {
                  'AWS:SourceArn': distributionARN,
                },
              },
            },
          ],
        },
      });
    }

    const bucketDeploymentProps: s3deploy.BucketDeploymentProps = {
      destinationBucket: this.docsBucket,
      sources: [s3deploy.Source.asset(path.resolve(docsRootPath))],
      prune: true,
      ...(this.distribution && {
        distribution: this.distribution,
        distributionPaths: ['/*'],
      }),
    };

    new s3deploy.BucketDeployment(this, 'DeployDocs', bucketDeploymentProps);

    const accessLogsBucket = new s3.Bucket(this, 'DocumentationAccessLogs', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      lifecycleRules: [
        {
          id: 'deleteOldLogs',
          enabled: true,
          expiration: cdk.Duration.days(90),
        },
      ],
    });

    new cdk.CfnOutput(this, 'DocumentationBucketName', {
      value: this.docsBucket.bucketName,
      description: 'Name of the secure S3 bucket containing documentation',
    });

    new cdk.CfnOutput(this, 'DocumentationBucketArn', {
      value: this.docsBucket.bucketArn,
      description: 'ARN of the documentation S3 bucket',
    });

    new cdk.CfnOutput(this, 'AccessLogsBucketName', {
      value: accessLogsBucket.bucketName,
      description: 'S3 bucket for access logs',
    });

    new cdk.CfnOutput(this, 'DocumentationS3Url', {
      value: `s3://${this.docsBucket.bucketName}`,
      description: 'S3 path to documentation bucket',
      exportName: 'DocumentationBucketUrl',
    });

    if (this.distribution) {
      new cdk.CfnOutput(this, 'DocumentationCloudFrontUrl', {
        value: `https://${this.distribution.distributionDomainName}`,
        description: 'CloudFront URL for documentation',
      });
    }

    new cdk.CfnOutput(this, 'SamplePreSignedUrlCommand', {
      value: `aws s3 presign s3://${this.docsBucket.bucketName}/index.html --expires-in 3600`,
      description: 'Command to generate pre-signed URL for accessing documentation',
    });
  }
}
