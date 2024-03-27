import {
  AIClient,
  AzureOpenAIClientParams,
  ChatCompletion,
  ChatCompletionOptions,
  ChatRequestMessage,
  Embedding,
  EmbeddingOptions,
} from "@one-beyond-ai/common";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { mapChatCompletionOptions, mapFinishReason, mapMessage, mapUsage } from "./mappers";

export class AzureOpenAIClient implements AIClient {
  private readonly client: OpenAIClient;
  public readonly type = 'azure-openai';

  constructor(public readonly options: AzureOpenAIClientParams) {
    this.client = new OpenAIClient(this.options.endpoint, new AzureKeyCredential(this.options.apiKey), {
      apiVersion: this.options.version,
    });
  }

  public getClient(): OpenAIClient {
    return this.client;
  }

  public async getChatCompletion(messages: ChatRequestMessage[], options?: ChatCompletionOptions): Promise<ChatCompletion> {
    const result = await this.client.getChatCompletions(this.options.deploymentName, messages, mapChatCompletionOptions(options));
    return {
      choices: result.choices.map((choice) => ({
        message: mapMessage(choice.message),
        delta: mapMessage(choice.delta),
        finishReason: mapFinishReason(choice.finishReason)
      })),
      usage: mapUsage(result.usage)
    };
  }

  public async getEmbeddings(input: string[], options?: EmbeddingOptions): Promise<Embedding> {
    return this.client.getEmbeddings(this.options.deploymentName, input, options);
  }
}
