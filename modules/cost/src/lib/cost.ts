import { AIClient, ChatCompletion, CompletionCost, Embedding, EmbeddingCost } from '@one-beyond-ai/common';

export class Cost {
  constructor(private readonly client: AIClient) {}

  public getTokenCost(token = 0): number {
    const tokenCost = this.client.options.tokenCost;
    if (!tokenCost) return 0;
    return tokenCost * token;
  }

  public getCompletionCost(token = 0): number {
    const completionCost = this.client.options.completionCost;
    if (!completionCost) return 0;
    return completionCost * token;
  }

  public getChatCompletionCost(response: ChatCompletion): CompletionCost {
    const currency = this.client.options.currency;
    if (currency) {
      const tokenCost = this.getTokenCost(response.usage.promptTokens);
      const completionCost = this.getCompletionCost(response.usage.completionTokens);
      const total = tokenCost + completionCost;
      return { token: tokenCost, completion: completionCost, total, currency: currency };
    } else return { token: 0, completion: 0, total: 0, currency: '' };
  }

  public getEmbeddingCost(response: Embedding): EmbeddingCost {
    const currency = this.client.options.currency;
    if (currency) {
      const tokenCost = this.getTokenCost(response.usage.promptTokens);
      return { token: tokenCost, total: tokenCost, currency: currency };
    } else return { token: 0, total: 0, currency: '' };
  }
}
