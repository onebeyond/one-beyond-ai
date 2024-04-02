import { AIClient } from "@one-beyond-ai/common";
import { Cost } from "./cost";
import { expect } from "vitest";

describe('Cost Module', () => {
  const client = {
    options: {
      tokenCost: 0.024 / 1000,
      completionCost: 0.048 / 1000,
      currency: 'GBP'
    }
  } as AIClient;
  const cost = new Cost(client);
  it('should calculate token and completion costs', () => {
    expect(cost.getTokenCost()).toEqual(0);
    expect(cost.getTokenCost(1)).toEqual(client.options.tokenCost);
    expect(cost.getCompletionCost()).toEqual(0);
    expect(cost.getCompletionCost(1)).toEqual(client.options.completionCost);
  });
  it('should calculate chat completion costs', () => {
    const result = cost.getChatCompletionCost({ usage: { promptTokens: 1, completionTokens: 1 } } as any);
    expect(result.token).toEqual(client.options.tokenCost);
    expect(result.completion).toEqual(client.options.completionCost);
    expect(result.total).toEqual(client.options.tokenCost + client.options.completionCost);
    expect(result.currency).toEqual(client.options.currency);
  });
  it('should calculate embedding costs', () => {
    const result = cost.getEmbeddingCost({ usage: { promptTokens: 1 } } as any);
    expect(result.token).toEqual(client.options.tokenCost);
    expect(result.total).toEqual(client.options.tokenCost);
    expect(result.currency).toEqual(client.options.currency);
  });
});
