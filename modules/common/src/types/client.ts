import { ChatCompletion, ChatRequestMessage } from "./completion";

export type ModelParams = {
  tokenCost: number;
  completionCost: number;
  contextSize: number;
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

  getChatCompletion(messages: ChatRequestMessage[]): Promise<ChatCompletion>;

  getEmbeddings(text: string[]): unknown;
}
