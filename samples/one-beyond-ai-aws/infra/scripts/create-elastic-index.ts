import { Client } from '@elastic/elasticsearch';
import 'dotenv/config';

const client = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    username: process.env.ELASTIC_USERNAME ?? '',
    password: process.env.ELASTIC_PASSWORD ?? '',
  },
  tls: {
    ca: process.env.ELASTIC_CA_CERT ?? '',
    rejectUnauthorized: false,
  },
});

(async () => {
  await client.ping();
  await client.indices.create({
    index: 'documents',
    mappings: {
      properties: {
        id: { type: 'keyword', store: true },
        text: { type: 'text', store: true },
        text_embedding_3_large: {
          type: 'dense_vector',
          dims: 3072,
          index: true,
          similarity: 'cosine',
        },
        vectors: {
          type: 'join',
          relations: {
            chunk_embedding: 'text_embedding_3_large',
          },
        },
      },
    },
  });
})();
