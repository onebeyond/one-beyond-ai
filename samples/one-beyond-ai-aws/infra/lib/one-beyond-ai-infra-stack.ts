import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { getResourceName } from '../util';
import { SnsDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import 'dotenv/config'
const { REGION, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;

function assertEnvironmentVariable (variable: string | undefined, name: string): asserts variable is string {
  if (!variable) {
    throw new Error(`Environment variable ${name} is not set`);
  }
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    assertEnvironmentVariable(REGION, 'REGION');
    assertEnvironmentVariable(S3_ENDPOINT, 'S3_ENDPOINT');
    assertEnvironmentVariable(S3_ACCESS_KEY_ID, 'S3_ACCESS_KEY_ID');
    assertEnvironmentVariable(S3_SECRET_ACCESS_KEY, 'S3_SECRET_ACCESS_KEY');

    const bucket = new s3.Bucket(this, getResourceName('FileBucket'), {
      bucketName: 'file-bucket',
    });
    const topic = new sns.Topic(this, getResourceName('FilePutEventTopic'), {
      topicName: getResourceName('FilePutEventTopic'),
    });
    const lambda = new NodejsFunction(this, getResourceName('FileUploadedEventHandler'), {
      functionName: getResourceName('FileUploadedEventHandler'),
      runtime: Runtime.NODEJS_20_X,
      entry: 'lambdas/file-uploaded-event-handler.ts',
      bundling: {
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
        target: 'esnext',
        banner: "import path from 'path'; import { fileURLToPath } from 'url'; import { createRequire } from 'module';const require = createRequire(import.meta.url); const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);",
      },
      environment: {
        REGION,
        S3_ENDPOINT,
        S3_ACCESS_KEY_ID,
        S3_SECRET_ACCESS_KEY,
      },
    });

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new SnsDestination(topic));

    const queue = new sqs.Queue(this, getResourceName('FileUploadedEventQueue'), {
      queueName: getResourceName('FileUploadedEventQueue'),
      visibilityTimeout: cdk.Duration.seconds(120),
    });

    const subscription = new SqsSubscription(queue);
    topic.addSubscription(subscription);

    const eventSource = new lambdaEventSources.SqsEventSource(queue, {
      batchSize: 1,
      maxConcurrency: 5,
    });
    lambda.addEventSource(eventSource);

    new cdk.CfnOutput(this, getResourceName('FilePutEventTopicArn'), {
      value: topic.topicArn,
    });
    new cdk.CfnOutput(this, getResourceName('FileUploadedEventQueueArn'), {
      value: queue.queueArn,
    });
    new cdk.CfnOutput(this, getResourceName('FileUploadedEventQueueUrl'), {
      value: queue.queueUrl,
    });
    new cdk.CfnOutput(this, getResourceName('FileUploadHandlerArn'), {
      value: lambda.functionArn,
    });
    new cdk.CfnOutput(this, getResourceName('sBucketArn'), {
      value: bucket.bucketArn,
    });
  }
}
