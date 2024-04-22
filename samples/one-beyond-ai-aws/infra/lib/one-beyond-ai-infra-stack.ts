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
import { assertEnvironmentVariable } from '@one-beyond-ai/common';
import * as LambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import 'dotenv/config'
const { REGION, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, EMBEDDING_MODEL, AZURE_OPENAI_API_KEY } = process.env;

const banner = "import path from 'path'; import { fileURLToPath } from 'url'; import { createRequire } from 'module';const require = createRequire(import.meta.url); const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    assertEnvironmentVariable(REGION, 'REGION');
    assertEnvironmentVariable(S3_ENDPOINT, 'S3_ENDPOINT');
    assertEnvironmentVariable(S3_ACCESS_KEY_ID, 'S3_ACCESS_KEY_ID');
    assertEnvironmentVariable(S3_SECRET_ACCESS_KEY, 'S3_SECRET_ACCESS_KEY');
    assertEnvironmentVariable(EMBEDDING_MODEL, 'EMBEDDING_MODEL');
    assertEnvironmentVariable(AZURE_OPENAI_API_KEY, 'AZURE_OPENAI_API_KEY');

    const bucket = new s3.Bucket(this, getResourceName('FileBucket'), {
      bucketName: 'file-bucket',
    });

    const filePutEventTopic = new sns.Topic(this, getResourceName('FilePutEventTopic'), {
      topicName: getResourceName('FilePutEventTopic'),
    });

    const textEmbedTopic = new sns.Topic(this, getResourceName('textEmbedTopic'), {
      topicName: getResourceName('textEmbedTopic'),
    });

    const fileUploadedEventHandlerLambda = new NodejsFunction(this, getResourceName('FileUploadedEventHandler'), {
      functionName: getResourceName('FileUploadedEventHandler'),
      runtime: Runtime.NODEJS_20_X,
      entry: 'lambdas/file-uploaded-event-handler.ts',
      timeout: cdk.Duration.seconds(30),
      bundling: {
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
        target: 'esnext',
        banner,
      },
      environment: {
        REGION,
        S3_ENDPOINT,
        S3_ACCESS_KEY_ID,
        S3_SECRET_ACCESS_KEY,
        TEXT_EMBED_TOPIC_ARN: textEmbedTopic.topicArn,
        EMBEDDING_MODEL,
      },
    });

    const textEmbedEventHandlerLambda = new NodejsFunction(this, getResourceName('TextEmbedEventHandler'), {
      functionName: getResourceName('TextEmbedEventHandler'),
      runtime: Runtime.NODEJS_20_X,
      entry: 'lambdas/text-embedder.ts',
      bundling: {
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
        target: 'esnext',
        banner,
      },
      environment: {
        EMBEDDING_MODEL,
        AZURE_OPENAI_API_KEY,
      },
    });

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new SnsDestination(filePutEventTopic));

    const filePutEventQueue = new sqs.Queue(this, getResourceName('FileUploadedEventQueue'), {
      queueName: getResourceName('FileUploadedEventQueue'),
      visibilityTimeout: cdk.Duration.seconds(120),
    });

    const textEmbedEventQueue = new sqs.Queue(this, getResourceName('TextEmbedEventQueue'), {
      queueName: getResourceName('TextEmbedEventQueue'),
      visibilityTimeout: cdk.Duration.seconds(120),
    });

    const filePutEventSubscription = new SqsSubscription(filePutEventQueue);
    filePutEventTopic.addSubscription(filePutEventSubscription);

    const textEmbedEventSubscription = new SqsSubscription(textEmbedEventQueue);
    textEmbedTopic.addSubscription(textEmbedEventSubscription);

    const fileUploadedEventSource = new LambdaEventSources.SqsEventSource(filePutEventQueue, {
      batchSize: 1,
      maxConcurrency: 5,
    });
    fileUploadedEventHandlerLambda.addEventSource(fileUploadedEventSource);

    const textEmbedEventSource = new LambdaEventSources.SqsEventSource(textEmbedEventQueue, {
      batchSize: 1,
      maxConcurrency: 5,
    });
    textEmbedEventHandlerLambda.addEventSource(textEmbedEventSource);

    new cdk.CfnOutput(this, getResourceName('FilePutEventTopicArn'), {
      value: filePutEventTopic.topicArn,
    });
    new cdk.CfnOutput(this, getResourceName('FileUploadedEventQueueArn'), {
      value: filePutEventQueue.queueArn,
    });
    new cdk.CfnOutput(this, getResourceName('FileUploadedEventQueueUrl'), {
      value: filePutEventQueue.queueUrl,
    });
    new cdk.CfnOutput(this, getResourceName('FileUploadedEventHandlerArn'), {
      value: fileUploadedEventHandlerLambda.functionArn,
    });
    new cdk.CfnOutput(this, getResourceName('sBucketArn'), {
      value: bucket.bucketArn,
    });
  }
}
