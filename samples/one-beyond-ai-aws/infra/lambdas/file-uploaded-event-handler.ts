import { TextExtractor } from '@one-beyond-ai/text-document-extractor';
import { SQSHandler, SQSEvent, S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as mime from 'mime-types';
import { assertIsFileTypeSupported } from "@one-beyond-ai/common";

const s3 = new S3({
  region: process.env.REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
});
const textExtractor = new TextExtractor();

export const handler: SQSHandler = async (event: SQSEvent) => {
  const rawMessage = event.Records[0].body;
  const message = JSON.parse(rawMessage);
  const s3Event: S3Event = JSON.parse(message.Message);
  const s3EventRecord = s3Event.Records[0];
  const bucket = s3EventRecord.s3.bucket.name;
  const key = s3EventRecord.s3.object.key;
  const readable = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
  const contentType = mime.lookup(key);
  if (!contentType) {
    throw new Error('Unsupported file type');
  }
  const extension = mime.extension(contentType);
  if (!extension) {
    throw new Error('Unsupported file type');
  }
  assertIsFileTypeSupported(extension);
  const extractedText = await textExtractor.extractText(readable, extension);
};
