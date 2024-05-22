import { SQSHandler, SQSEvent } from 'aws-lambda';
import { TokenizerDocument, assertEnvironmentVariable, assertIsModelSupported } from '@one-beyond-ai/common';
import { EmbeddingResult } from '@one-beyond-ai/embed';
import { extractSqsMessage } from '../util';
import { Client } from '@elastic/elasticsearch';

const { EMBEDDING_MODEL, ELASTIC_NODE, ELASTIC_USERNAME, ELASTIC_PASSWORD, ELASTIC_CA_CERT, ELASTIC_INDEX } =
  process.env;

assertEnvironmentVariable(ELASTIC_NODE, 'ELASTIC_NODE');
assertEnvironmentVariable(ELASTIC_USERNAME, 'ELASTIC_USERNAME');
assertEnvironmentVariable(ELASTIC_PASSWORD, 'ELASTIC_PASSWORD');
assertEnvironmentVariable(ELASTIC_CA_CERT, 'ELASTIC_CA_CERT');

const client = new Client({
  node: ELASTIC_NODE,
  auth: {
    username: ELASTIC_USERNAME,
    password: ELASTIC_PASSWORD,
  },
  tls: {
    ca: ELASTIC_CA_CERT,
    rejectUnauthorized: false,
  },
});

// TODO: finish inserting the document into elastic search
// export const handler: SQSHandler = async (event: SQSEvent) => {
//   assertEnvironmentVariable(ELASTIC_INDEX, 'ELASTIC_INDEX');
//   assertIsModelSupported(EMBEDDING_MODEL);
//   console.log(process.env.EMBEDDING_MODEL);
//   const result = extractSqsMessage<TokenizerDocument & EmbeddingResult>(event);
//   client.index({
//     "id": `${text['id']}_${vector_index}`,
//     "embedding_bge_large_en_v1_5": vector,
//     "vectors": {
//       "name": "embedding_bge_large_en_v1_5",
//       "parent": text['id']
//     },
//     "routing": 1
//   } )
// };
