import { SQSHandler, SQSEvent } from 'aws-lambda';
import { assertEnvironmentVariable } from "@one-beyond-ai/common";
import { extractSqsMessage } from '../util';

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log(process.env.EMBEDDING_MODEL);
  assertEnvironmentVariable(process.env.AZURE_OPENAI_API_KEY, 'AZURE_OPENAI_API_KEY');
  const documentToEmbed = extractSqsMessage<any>(event)
  console.log(documentToEmbed);
};
