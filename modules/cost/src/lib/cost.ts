import { AIClient, ChatCompletion, CompletionCost, Embedding, EmbeddingCost } from "@one-beyond-ai/common";

export class Cost {
  constructor(private readonly client: AIClient) {
  }

  public getTokenCost(token = 0): number {
    return this.client.options.tokenCost * token;
  }

  public getCompletionCost(token = 0): number {
    return this.client.options.completionCost * token;
  }

  public getChatCompletionCost(response: ChatCompletion): CompletionCost {
    const tokenCost = this.getTokenCost(response.usage.promptTokens);
    const completionCost = this.getCompletionCost(response.usage.completionTokens);
    const total = tokenCost + completionCost;
    return { token: tokenCost, completion: completionCost, total, currency: this.client.options.currency };
  }

  public getEmbeddingCost(response: Embedding): EmbeddingCost {
    const tokenCost = this.getTokenCost(response.usage.promptTokens);
    return { token: tokenCost, total: tokenCost, currency: this.client.options.currency };
  }
}
