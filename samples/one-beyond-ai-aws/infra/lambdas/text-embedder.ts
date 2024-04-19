import { SQSHandler, SQSEvent } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log(process.env.EMBEDDING_MODEL);
};
