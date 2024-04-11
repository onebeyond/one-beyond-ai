import { ChatCompletion, ChatCompletionOptions, ChatRequestMessage } from "./completion";
import { Embedding, EmbeddingOptions } from "./embedding";
import { ReadStream } from "fs";
import { AudioTranscriptionOptions, AudioTranscriptionResult, AudioTranscriptionResultFormat } from "./audio-transcription";

export const TokenizerModels = [
  "davinci-002",
  "babbage-002",
  "text-davinci-003",
  "text-davinci-002",
  "text-davinci-001",
  "text-curie-001",
  "text-babbage-001",
  "text-ada-001",
  "davinci",
  "curie",
  "babbage",
  "ada",
  "code-davinci-002",
  "code-davinci-001",
  "code-cushman-002",
  "code-cushman-001",
  "davinci-codex",
  "cushman-codex",
  "text-davinci-edit-001",
  "code-davinci-edit-001",
  "text-embedding-ada-002",
  "text-similarity-davinci-001",
  "text-similarity-curie-001",
  "text-similarity-babbage-001",
  "text-similarity-ada-001",
  "text-search-davinci-doc-001",
  "text-search-curie-doc-001",
  "text-search-babbage-doc-001",
  "text-search-ada-doc-001",
  "code-search-babbage-code-001",
  "code-search-ada-code-001",
  "gpt2",
  "gpt-3.5-turbo",
  "gpt-35-turbo",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-16k-0613",
  "gpt-3.5-turbo-instruct",
  "gpt-3.5-turbo-instruct-0914",
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0314",
  "gpt-4-32k-0613",
  "gpt-4-turbo-preview",
  "gpt-4-1106-preview",
  "gpt-4-0125-preview",
  "gpt-4-vision-preview"
] as const;

export type TokenizerModel = typeof TokenizerModels[number];

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
