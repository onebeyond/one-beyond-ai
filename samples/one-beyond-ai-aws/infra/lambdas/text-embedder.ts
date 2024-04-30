import { SQSHandler, SQSEvent } from 'aws-lambda';
import { TokenizerDocument, assertEnvironmentVariable, assertIsModelSupported } from '@one-beyond-ai/common';
import { Embed } from '@one-beyond-ai/embed';
import { AzureOpenAIClient } from '@one-beyond-ai/azure-openai';
import { extractSqsMessage } from '../util';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const {
  AZURE_OPENAI_API_KEY,
  EMBEDDING_MODEL,
  AZURE_OPENAI_API_VERSION,
  AZURE_OPENAI_API_ENDPOINT,
  AZURE_OPENAI_DEPLOYMENT_NAME,
  ELASTIC_DOCUMENT_INDEX_TOPIC_ARN,
  REGION,
} = process.env;

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log(process.env.EMBEDDING_MODEL);
  assertEnvironmentVariable(AZURE_OPENAI_API_KEY, 'AZURE_OPENAI_API_KEY');
  assertEnvironmentVariable(AZURE_OPENAI_API_VERSION, 'AZURE_OPENAI_API_VERSION');
  assertEnvironmentVariable(AZURE_OPENAI_API_ENDPOINT, 'AZURE_OPENAI_API_ENDPOINT');
  assertEnvironmentVariable(AZURE_OPENAI_DEPLOYMENT_NAME, 'AZURE_OPENAI_DEPLOYMENT_NAME');
  assertEnvironmentVariable(ELASTIC_DOCUMENT_INDEX_TOPIC_ARN, 'ELASTIC_DOCUMENT_INDEX_TOPIC_ARN');
  assertEnvironmentVariable(ELASTIC_DOCUMENT_INDEX_TOPIC_ARN, 'ELASTIC_DOCUMENT_INDEX_TOPIC_ARN');
  assertEnvironmentVariable(REGION, 'REGION');
  assertIsModelSupported(EMBEDDING_MODEL);

  const documentToEmbed = extractSqsMessage<TokenizerDocument>(event);
  const azureOpenAIClient = new AzureOpenAIClient({
    apiKey: AZURE_OPENAI_API_KEY,
    tokenizerModel: EMBEDDING_MODEL,
    version: AZURE_OPENAI_API_VERSION,
    endpoint: AZURE_OPENAI_API_ENDPOINT,
    deploymentName: AZURE_OPENAI_DEPLOYMENT_NAME,
  });
  const embed = new Embed(azureOpenAIClient);
  const embedResult = await embed.embed(documentToEmbed);
  const snsClient = new SNSClient({ region: REGION });
  await snsClient.send(
    new PublishCommand({
      TopicArn: ELASTIC_DOCUMENT_INDEX_TOPIC_ARN,
      Message: JSON.stringify(embedResult),
    })
  );
};
