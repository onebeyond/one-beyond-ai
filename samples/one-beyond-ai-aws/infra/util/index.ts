import { SQSEvent } from 'aws-lambda';
import 'dotenv/config'
const { ENV_PREFIX, STACK_NAME } = process.env;

export const getResourceName = (resourceName: string) => `${ENV_PREFIX}${STACK_NAME}${resourceName}`;

export const extractSqsMessage = <T>(event: SQSEvent): T => {
  const rawBody = event.Records[0].body;
  const body = JSON.parse(rawBody);
  const message = JSON.parse(body.Message) as T;
  return message;
};
