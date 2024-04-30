import { TextExtractor } from '@one-beyond-ai/text-document-extractor';
import { Tokenizer } from '@one-beyond-ai/tokenizer';
import { SQSHandler, SQSEvent, S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import * as mime from 'mime-types';
import { MaxTokens, assertEnvironmentVariable, assertIsFileTypeSupported, assertIsModelSupported } from '@one-beyond-ai/common';
import { extractSqsMessage } from '../util';

const {
  REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  EMBEDDING_MODEL,
  TEXT_EMBED_TOPIC_ARN,
} = process.env;

assertEnvironmentVariable(REGION, 'REGION');
assertEnvironmentVariable(S3_ACCESS_KEY_ID, 'S3_ACCESS_KEY_ID');
assertEnvironmentVariable(S3_SECRET_ACCESS_KEY, 'S3_SECRET_ACCESS_KEY');
assertEnvironmentVariable(S3_ENDPOINT, 'S3_ENDPOINT');

const s3 = new S3({
  region: REGION,
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  endpoint: S3_ENDPOINT,
  s3ForcePathStyle: true,
});
const textExtractor = new TextExtractor();

export const handler: SQSHandler = async (event: SQSEvent) => {
  assertEnvironmentVariable(EMBEDDING_MODEL, 'EMBEDDING_MODEL');
  assertEnvironmentVariable(TEXT_EMBED_TOPIC_ARN, 'TEXT_EMBED_TOPIC_ARN');

  const model = EMBEDDING_MODEL;

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

  const snsClient = new SNSClient({ region: REGION });
  for (const page of extractedText.pages) {
    const chunks = await tokenizer.splitDocument(page.text, originalDocument);
    for (const chunk of chunks) {
      await snsClient.send(
        new PublishCommand({
          TopicArn: TEXT_EMBED_TOPIC_ARN,
          Message: JSON.stringify(chunk),
        })
      );
    }
  }
};
