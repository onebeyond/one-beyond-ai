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
import 'dotenv/config';
const {
  REGION,
  S3_ENDPOINT,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  EMBEDDING_MODEL,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_API_VERSION,
  AZURE_OPENAI_API_ENDPOINT,
  AZURE_OPENAI_DEPLOYMENT_NAME,
  ELASTIC_NODE,
  ELASTIC_USERNAME,
  ELASTIC_PASSWORD,
  ELASTIC_INDEX,
  ELASTIC_CA_CERT,
} = process.env;

const banner =
  "import path from 'path'; import { fileURLToPath } from 'url'; import { createRequire } from 'module';const require = createRequire(import.meta.url); const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    assertEnvironmentVariable(REGION, 'REGION');
    assertEnvironmentVariable(S3_ENDPOINT, 'S3_ENDPOINT');
    assertEnvironmentVariable(S3_ACCESS_KEY_ID, 'S3_ACCESS_KEY_ID');
    assertEnvironmentVariable(S3_SECRET_ACCESS_KEY, 'S3_SECRET_ACCESS_KEY');
    assertEnvironmentVariable(EMBEDDING_MODEL, 'EMBEDDING_MODEL');
    assertEnvironmentVariable(AZURE_OPENAI_API_KEY, 'AZURE_OPENAI_API_KEY');
    assertEnvironmentVariable(AZURE_OPENAI_API_VERSION, 'AZURE_OPENAI_API_VERSION');
    assertEnvironmentVariable(AZURE_OPENAI_API_ENDPOINT, 'AZURE_OPENAI_API_ENDPOINT');
    assertEnvironmentVariable(AZURE_OPENAI_DEPLOYMENT_NAME, 'AZURE_OPENAI_DEPLOYMENT_NAME');
    assertEnvironmentVariable(ELASTIC_NODE, 'ELASTIC_NODE');
    assertEnvironmentVariable(ELASTIC_USERNAME, 'ELASTIC_USERNAME');
    assertEnvironmentVariable(ELASTIC_PASSWORD, 'ELASTIC_PASSWORD');
    assertEnvironmentVariable(ELASTIC_INDEX, 'ELASTIC_INDEX');
    assertEnvironmentVariable(ELASTIC_CA_CERT, 'ELASTIC_CA_CERT');

    const bucket = new s3.Bucket(this, getResourceName('FileBucket'), {
      bucketName: 'file-bucket',
    });

    const filePutEventTopic = new sns.Topic(this, getResourceName('FilePutEventTopic'), {
      topicName: getResourceName('FilePutEventTopic'),
    });

    const textEmbedTopic = new sns.Topic(this, getResourceName('textEmbedTopic'), {
      topicName: getResourceName('textEmbedTopic'),
    });

    const elasticDocumentIndexTopic = new sns.Topic(this, getResourceName('ElasticDocumentIndexTopic'), {
      topicName: getResourceName('ElasticDocumentIndexTopic'),
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
      timeout: cdk.Duration.seconds(30),
      bundling: {
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
        target: 'esnext',
        banner,
      },
      environment: {
        EMBEDDING_MODEL,
        AZURE_OPENAI_API_KEY,
        AZURE_OPENAI_API_VERSION,
        AZURE_OPENAI_API_ENDPOINT,
        AZURE_OPENAI_DEPLOYMENT_NAME,
        ELASTIC_DOCUMENT_INDEX_TOPIC_ARN: elasticDocumentIndexTopic.topicArn,
        REGION,
      },
    });

    const elasticDocumentIndexerLambda = new NodejsFunction(this, getResourceName('ElasticDocumentIndexer'), {
      functionName: getResourceName('ElasticDocumentIndexer'),
      runtime: Runtime.NODEJS_20_X,
      entry: 'lambdas/elastic-document-indexer.ts',
      timeout: cdk.Duration.seconds(30),
      bundling: {
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
        target: 'esnext',
        banner,
      },
      environment: {
        EMBEDDING_MODEL,
        ELASTIC_NODE,
        ELASTIC_USERNAME,
        ELASTIC_PASSWORD,
        ELASTIC_INDEX,
        ELASTIC_CA_CERT,
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

    const elasticDocumentIndexEventQueue = new sqs.Queue(this, getResourceName('ElasticDocumentIndexEventQueue'), {
      queueName: getResourceName('ElasticDocumentIndexEventQueue'),
      visibilityTimeout: cdk.Duration.seconds(120),
    });

    const filePutEventSubscription = new SqsSubscription(filePutEventQueue);
    filePutEventTopic.addSubscription(filePutEventSubscription);

    const textEmbedEventSubscription = new SqsSubscription(textEmbedEventQueue);
    textEmbedTopic.addSubscription(textEmbedEventSubscription);

    const elasticDocumentIndexEventSubscription = new SqsSubscription(elasticDocumentIndexEventQueue);
    elasticDocumentIndexTopic.addSubscription(elasticDocumentIndexEventSubscription);

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

    const elasticDocumentIndexEventSource = new LambdaEventSources.SqsEventSource(elasticDocumentIndexEventQueue, {
      batchSize: 1,
      maxConcurrency: 5,
    });
    elasticDocumentIndexerLambda.addEventSource(elasticDocumentIndexEventSource);

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
