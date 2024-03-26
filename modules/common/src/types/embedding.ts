export type EmbeddingOptions = {
  user?: string;
  model?: string;
}

export type EmbeddingUsage = {
  promptTokens: number;
  totalTokens: number;
}

export type EmbeddingItem = {
  embedding: number[];
  index: number;
}
export type Embedding = {
  data: EmbeddingItem[];
  usage: EmbeddingUsage;
}
