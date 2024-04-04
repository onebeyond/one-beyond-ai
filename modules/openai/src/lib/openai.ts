import {
  AIClient, AudioTranscriptionOptions, AudioTranscriptionResult, AudioTranscriptionResultFormat,
  ChatCompletion,
  ChatCompletionOptions,
  ChatRequestMessage, Embedding, EmbeddingOptions,
  OpenAIClientParams
} from "@one-beyond-ai/common";
import OpenAI from "openai";
import {
  mapChatCompletionOptions,
  mapChatRequestMessages,
  mapEmbeddingUsage,
  mapCompletionResponseMessage,
  mapUsage,
  mapAudioTranscriptionResultVerboseJson
} from "./mappers";
import { ReadStream } from "fs";

export class OpenAIClient implements AIClient {
  private readonly client: OpenAI;
  public readonly type = 'openai';

  constructor(public readonly options: OpenAIClientParams) {
    this.client = new OpenAI({
      apiKey: this.options.apiKey
    });
  }

  public getClient(): OpenAI {
    return this.client;
  }

  public async getChatCompletion(messages: ChatRequestMessage[], options?: ChatCompletionOptions): Promise<ChatCompletion> {
    const result = await this.client.chat.completions.create({
      ...mapChatCompletionOptions(options),
      messages: mapChatRequestMessages(messages),
      model: this.options.model,
      stream: false,
    });

    return {
      choices: result.choices.map((choice) => ({
        message: mapCompletionResponseMessage(choice.message),
        finishReason: choice.finish_reason
      })),
      usage: mapUsage(result.usage)
    };
  }

  public async getEmbeddings(input: string[], options?: EmbeddingOptions): Promise<Embedding> {
    const result = await this.client.embeddings.create({
      ...options,
      model: this.options.model,
      input: input,
    });
    return {
      data: result.data,
      usage: mapEmbeddingUsage(result.usage)
    }
  }

  public async getAudioTranscription<Format extends AudioTranscriptionResultFormat>(stream: ReadStream, format: Format, options?: AudioTranscriptionOptions): Promise<AudioTranscriptionResult<Format>> {
    const result = await this.client.audio.transcriptions.create({
      model: this.options.model,
      file: stream,
      ...options,
      response_format: format
    });

    switch (format) {
      case "text":
      case "srt":
      case "vtt":
        return result as AudioTranscriptionResult<Format>;
      case "json":
        return {
          text: result.text,
        } as AudioTranscriptionResult<Format>
      case "verbose_json":
        return mapAudioTranscriptionResultVerboseJson(result) as AudioTranscriptionResult<Format>;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}
