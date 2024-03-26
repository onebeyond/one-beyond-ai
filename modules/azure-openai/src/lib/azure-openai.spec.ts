import { AzureKeyCredential, ChatCompletions, Embeddings, OpenAIClient as openAIClient } from "@azure/openai";
import { AzureOpenAIClient } from "./azure-openai";
import { AzureOpenAIClientParams, ChatRequestMessage } from "@one-beyond-ai/common";
import { describe, MockedClass } from "vitest";

vi.mock('@azure/openai');
const OpenAIClient: MockedClass<typeof openAIClient> = openAIClient as MockedClass<typeof openAIClient>;

const clientOptions: AzureOpenAIClientParams = {
  apiKey: '123',
  endpoint: 'https://example.one-beyond.com/',
  deploymentName: 'gpt-4',
  version: "2024-02-15-preview",
  completionCost: 0,
  tokenCost: 0,
  contextSize: 32,
};

describe('Azure OpenAI Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("constructor", () => {
    it("should create an instance of AzureOpenAIClient", () => {
      const client = new AzureOpenAIClient(clientOptions);
      expect(client).toBeDefined();
      const endpoint = OpenAIClient.mock.calls[0][0];
      const version = OpenAIClient.mock.calls[0][2];
      expect(endpoint).toEqual(clientOptions.endpoint);
      expect(version).toEqual({ apiVersion: clientOptions.version });
      expect(AzureKeyCredential).toHaveBeenCalledWith(clientOptions.apiKey);
    });
  });
  describe("getChatCompletion", () => {
    it("should call azure openai client getChatCompletions", async () => {
      const spy = vi.spyOn(OpenAIClient.prototype, 'getChatCompletions');
      spy.mockResolvedValue({
        choices: [{
          message: {
            role: "assistant",
            content: "Paris",
          },
          finishReason: "stop"
        }],
        usage: {
          completionTokens: 0,
          promptTokens: 0,
          totalTokens: 0
        }
      } as ChatCompletions);
      const client = new AzureOpenAIClient(clientOptions);
      const messages: ChatRequestMessage[] = [
        {
          role: "user",
          content: 'What is the capital of France?',
        }
      ];
      const result = await client.getChatCompletion(messages);
      expect(result).toEqual({
        choices: [{
          message: {
            role: "assistant",
            content: "Paris",
          },
          finishReason: "stop"
        }],
        usage: {
          completionTokens: 0,
          promptTokens: 0,
          totalTokens: 0
        }
      });
      expect(OpenAIClient.prototype.getChatCompletions).toHaveBeenCalledWith(clientOptions.deploymentName, messages, undefined);
    });
  });
  describe("getEmbeddings", () => {
    it("should call azure openai client getEmbeddings", async () => {
      const spy = vi.spyOn(OpenAIClient.prototype, 'getEmbeddings');
      spy.mockResolvedValue({
        data: [
          {
            embedding: [0.1, 0.2, 0.3],
            index: 0
          }
        ],
        usage: {
          promptTokens: 0,
          totalTokens: 0
        }
      } as Embeddings);
      const client = new AzureOpenAIClient(clientOptions);
      const input = ['What is the capital of France?'];
      const result = await client.getEmbeddings(input);
      expect(result).toEqual({
        data: [
          {
            embedding: [0.1, 0.2, 0.3],
            index: 0
          }
        ],
        usage: {
          promptTokens: 0,
          totalTokens: 0
        }
      });
      expect(OpenAIClient.prototype.getEmbeddings).toHaveBeenCalledWith(clientOptions.deploymentName, input, undefined);
    });
  });
});




