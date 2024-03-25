import {
  AIClient,
  AzureOpenAIClientParams,
  ChatCompletion,
  ChatRequestMessage,
  ChatResponseMessage,
  CompletionsFinishReason,
  CompletionUsage
} from "@one-beyond-ai/common";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

export class AzureOpenAIClient implements AIClient {
  private readonly client: OpenAIClient;
  public readonly type = 'azure-openai';

  constructor(public readonly options: AzureOpenAIClientParams) {
    this.client = new OpenAIClient(this.options.endpoint, new AzureKeyCredential(this.options.apiKey));
  }

  public getClient(): OpenAIClient {
    return this.client;
  }

  private mapUsage(usage: any): CompletionUsage {
    return {
      completionTokens: usage?.completionTokens ?? 0,
      promptTokens: usage?.promptTokens ?? 0,
      totalTokens: usage?.totalTokens ?? 0
    };
  }

  private mapMessage(message: any): ChatResponseMessage | undefined {
    if (!message) {
      return undefined;
    }
    return {
      role: message.role,
      content: message.content,
      functionCall: message.functionCall
    };
  }

  private mapFinishReason(finishReason: string | null): CompletionsFinishReason | null {
    if (!finishReason) return null;
    switch (finishReason) {
      case 'stop':
        return CompletionsFinishReason.STOP;
      case 'length':
        return CompletionsFinishReason.LENGTH;
      case 'content_filter':
        return CompletionsFinishReason.CONTENT_FILTER;
      case 'function_call':
        return CompletionsFinishReason.FUNCTION_CALL;
    }
    return null;
  }

  public async getChatCompletion(messages: ChatRequestMessage[]): Promise<ChatCompletion> {
    const result = await this.client.getChatCompletions(this.options.deploymentName, messages);
    return {
      choices: result.choices.map((choice) => ({
        message: this.mapMessage(choice.message),
        delta: this.mapMessage(choice.delta),
        finishReason: this.mapFinishReason(choice.finishReason)
      })),
      usage: this.mapUsage(result.usage)
    };
  }

  public async getEmbeddings(text: string[]) {
    return this.client.getEmbeddings(this.options.deploymentName, text);
  }
}
