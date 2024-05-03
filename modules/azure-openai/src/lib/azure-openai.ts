import {
  AIClient, AudioTranscriptionOptions, AudioTranscriptionResult, AudioTranscriptionResultFormat,
  AzureOpenAIClientParams,
  ChatCompletion,
  ChatCompletionOptions,
  ChatRequestMessage,
  Embedding,
  EmbeddingOptions, streamToUint8Array,
} from "@one-beyond-ai/common";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { mapChatCompletionOptions, mapFinishReason, mapMessage, mapUsage } from "./mappers";
import { ReadStream } from "fs";

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

  public async *getChatCompletionEvents(messages: ChatRequestMessage[], options?: ChatCompletionOptions): AsyncGenerator<ChatCompletion, void, void> {
    const stream = await this.client.streamChatCompletions(this.options.deploymentName, messages, mapChatCompletionOptions(options));
    for await (const event of stream) {
      yield {
        choices: event.choices.map((choice) => ({
          message: mapMessage(choice.message),
          delta: mapMessage(choice.delta),
          finishReason: mapFinishReason(choice.finishReason)
        })),
        usage: mapUsage(event.usage)
      }
    }
  }

  public async getEmbeddings(input: string[], options?: EmbeddingOptions): Promise<Embedding> {
    return this.client.getEmbeddings(this.options.deploymentName, input, options);
  }

  public async getAudioTranscription<Format extends AudioTranscriptionResultFormat>(stream: ReadStream, format: Format, options?: AudioTranscriptionOptions): Promise<AudioTranscriptionResult<Format>> {
    const file = await streamToUint8Array(stream);
    return this.client.getAudioTranscription(this.options.deploymentName, file, format, options);
  }
}
