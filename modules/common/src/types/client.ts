import { ChatCompletion, ChatCompletionOptions, ChatRequestMessage } from "./completion";
import { Embedding, EmbeddingOptions } from "./embedding";
import { ReadStream } from "fs";
import { AudioTranscriptionOptions, AudioTranscriptionResult, AudioTranscriptionResultFormat } from "./audio-transcription";
import { OldTokenizerModels, TokenizerModels } from "../constants";

export type TokenizerModel = typeof TokenizerModels[number];

export type OldTokenizerModel = typeof OldTokenizerModels[number];

export type ModelParams = {
  tokenCost: number;
  completionCost: number;
  contextSize: number;
  currency: string;
  tokenizerModel: TokenizerModel;
}

export type OpenAIClientParams = ModelParams & {
  apiKey: string;
  model: string;
};

export type AzureOpenAIClientParams = ModelParams & {
  apiKey: string;
  endpoint: string;
  version: string;
  deploymentName: string;
};

export type ClientParams = AzureOpenAIClientParams | OpenAIClientParams;

export interface AIClient {
  options: ClientParams;

  getClient(): unknown;

  getChatCompletion(messages: ChatRequestMessage[], options?: ChatCompletionOptions): Promise<ChatCompletion>;

  getEmbeddings(input: string[], options?: EmbeddingOptions): Promise<Embedding>;

  getAudioTranscription<Format extends AudioTranscriptionResultFormat>(stream: ReadStream, format: Format, options?: AudioTranscriptionOptions): Promise<AudioTranscriptionResult<Format>>;
}
