export type CompletionCost = {
  token: number;
  completion: number;
  total: number;
  currency: string;
}

export type EmbeddingCost = {
  token: number;
  total: number;
  currency: string;
}
