import { TextExtractor } from '@one-beyond-ai/text-document-extractor';
import { SQSHandler, SQSEvent, S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { ReadStream } from 'fs';

const s3 = new S3({
  region: 'eu-west-1',
  accessKeyId: '',
  secretAccessKey: '',
  endpoint: 'http://localstack:4566',
  s3ForcePathStyle: true,
});
const textExtractor = new TextExtractor();

export const handler: SQSHandler = async (event: SQSEvent) => {
  const rawMessage = event.Records[0].body;
  const message = JSON.parse(rawMessage);
  const s3Event: S3Event = JSON.parse(message.Message);
  console.log('Record 0');
  console.log(s3Event.Records[0]);
  const s3EventRecord = s3Event.Records[0];
  const bucket = s3EventRecord.s3.bucket.name;
  const key = s3EventRecord.s3.object.key;
  console.log('s3Event:', JSON.stringify({ bucket, key }, null, 2));
  const readable = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
  const extractedText = await textExtractor.extractText(readable, 'txt');
  console.log(extractedText);
};
