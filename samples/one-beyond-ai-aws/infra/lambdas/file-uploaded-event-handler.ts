import { TextExtractor } from '@one-beyond-ai/text-document-extractor';
import { Tokenizer } from '@one-beyond-ai/tokenizer';
import { SQSHandler, SQSEvent, S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import * as mime from 'mime-types';
import { MaxTokens, assertIsFileTypeSupported, assertIsModelSupported } from '@one-beyond-ai/common';
import { extractSqsMessage } from '../util';

const s3 = new S3({
  region: process.env.REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
});
const textExtractor = new TextExtractor();

export const handler: SQSHandler = async (event: SQSEvent) => {
  const model = process.env.EMBEDDING_MODEL;

  assertIsModelSupported(model);
  const s3Event = extractSqsMessage<S3Event>(event);
  const s3EventRecord = s3Event.Records[0];
  const bucket = s3EventRecord.s3.bucket.name;
  const key = s3EventRecord.s3.object.key;
  const originalDocument = `${bucket}/${key}`;
  console.log(`Embedding file with model: ${model}`);
  const readable = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
  const contentType = mime.lookup(key);
  if (!contentType) {
    throw new Error(`Unidentified content type ${originalDocument}`);
  }
  const extension = mime.extension(contentType);
  if (!extension) {
    throw new Error(`Unidentified extension ${originalDocument}`);
  }

  assertIsFileTypeSupported(extension);
  const extractedText = await textExtractor.extractText(readable, extension, originalDocument);

  const tokenizer = new Tokenizer({
    model,
    splitChunkSize: MaxTokens[model],
    splitChunkOverlap: (MaxTokens[model] ?? 0) / 2,
  });

  for (const page of extractedText.pages) {
    const chunks = await tokenizer.splitDocument(page.text, originalDocument);
    const snsClient = new SNSClient({ region: process.env.REGION });
    for (const chunk of chunks) {
      await snsClient.send(
        new PublishCommand({
          TopicArn: process.env.TEXT_EMBED_TOPIC_ARN,
          Message: JSON.stringify(chunk),
        })
      );
    }
  }
};
