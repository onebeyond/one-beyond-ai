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

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, getResourceName('AnnouncementsBucket'), {
      bucketName: 'announcements-bucket',
    });
    const topic = new sns.Topic(this, getResourceName('AnnouncementFileEventTopic'), {
      topicName: getResourceName('AnnouncementFileEventTopic'),
    });
    const lambda = new NodejsFunction(this, getResourceName('AnnouncementFileUploadedEventHandler'), {
      functionName: getResourceName('AnnouncementFileUploadedEventHandler'),
      runtime: Runtime.NODEJS_20_X,
      entry: 'lambdas/announcement-uploaded-event-handler.ts',
      bundling: {
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
        target: 'esnext',
        banner: "import path from 'path'; import { fileURLToPath } from 'url'; import { createRequire } from 'module';const require = createRequire(import.meta.url); const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);",
      }
    });

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new SnsDestination(topic));

    const queue = new sqs.Queue(this, getResourceName('AnnouncementFileUploadedEventQueue'), {
      queueName: getResourceName('AnnouncementFileUploadedEventQueue'),
      visibilityTimeout: cdk.Duration.seconds(120),
    });

    const subscription = new SqsSubscription(queue, {
      // filterPolicy: {
      //   eventName: sns.SubscriptionFilter.stringFilter({
      //     allowlist: ['ObjectCreated:Put'],
      //   }),
      // },
    });

    topic.addSubscription(subscription);

    const eventSource = new lambdaEventSources.SqsEventSource(queue);
    lambda.addEventSource(eventSource);

    new cdk.CfnOutput(this, getResourceName('AnnouncementFileEventTopicArn'), {
      value: topic.topicArn,
    });
    new cdk.CfnOutput(this, getResourceName('AnnouncementFileUploadedEventQueueArn'), {
      value: queue.queueArn,
    });
    new cdk.CfnOutput(this, getResourceName('AnnouncementFileUploadedEventQueueUrl'), {
      value: queue.queueUrl,
    });
    new cdk.CfnOutput(this, getResourceName('AnnouncementFileUploadHandlerArn'), {
      value: lambda.functionArn,
    });
    new cdk.CfnOutput(this, getResourceName('AnnouncementsBucketArn'), {
      value: bucket.bucketArn,
    });
  }
}
