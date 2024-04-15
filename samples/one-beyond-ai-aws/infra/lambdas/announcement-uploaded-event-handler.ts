import { SQSHandler, SQSEvent } from 'aws-lambda';
import { TextExtractor } from "@one-beyond-ai/text-document-extractor";
import { S3 } from 'aws-sdk';

const s3 = new S3();

export const handler: SQSHandler = async (event: SQSEvent) => {
  const rawMessage = event.Records[0].body;
  const message = JSON.parse(rawMessage);
  console.log('message:', message);
  // const bucket = message.Records[0].s3.bucket.name;
  // const key = message.Records[0].s3.object.key;
  // const textExtractor = new TextExtractor();
};
