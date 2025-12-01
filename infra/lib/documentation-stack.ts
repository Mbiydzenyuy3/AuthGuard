import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import * as path from 'path';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

interface DocumentationStackProps extends cdk.StackProps {
  docsRootPath: string;
}

export class DocumentationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DocumentationStackProps) {
    super(scope, id, props);

    const { docsRootPath } = props;

    const docsBucket = new s3.Bucket(this, 'DocumentationBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const distribution = new cloudfront.Distribution(this, 'DocumentationDistro', {
      defaultBehavior: {
        origin: new origins.S3Origin(docsBucket),
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

    new s3deploy.BucketDeployment(this, 'DeployDocs', {
      destinationBucket: docsBucket,
      distribution,
      sources: [s3deploy.Source.asset(path.resolve(docsRootPath))],
    });

    new cdk.CfnOutput(this, 'DocumentationUrl', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
