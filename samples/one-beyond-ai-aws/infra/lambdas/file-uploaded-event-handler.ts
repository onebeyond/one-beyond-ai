import { TextExtractor } from '@one-beyond-ai/text-document-extractor';
import { SQSHandler, SQSEvent, S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { ReadStream } from 'fs';

const s3 = new S3();
const textExtractor = new TextExtractor();

export const handler: SQSHandler = async (event: SQSEvent) => {
  const rawMessage = event.Records[0].body;
  const message = JSON.parse(rawMessage);
  const s3Event: S3Event = JSON.parse(message.Message);
  const s3EventRecord = s3Event.Records[0];
  const bucket = s3EventRecord.s3.bucket.name;
  const key = s3EventRecord.s3.object.key;
  console.log('s3Event:', JSON.stringify({ bucket, key }, null, 2));
  const readStream = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
  const streamFromReadable = new ReadStream();
  streamFromReadable.push(readStream);
  const extractedText = await textExtractor.extractText(streamFromReadable, key);
};
