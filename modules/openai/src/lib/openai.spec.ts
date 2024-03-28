import { ChatRequestMessage, OpenAIClientParams } from "@one-beyond-ai/common";
import { OpenAIClient } from "./openai";
import { ChatCompletion } from "openai/resources/chat/completions";
import { OpenAI as openAI } from "openai";
import { beforeAll, MockedClass } from "vitest";

vi.mock('openai');
const completionCreateMock = vi.fn();
const embeddingsCreateMock = vi.fn();
const OpenAI = openAI as MockedClass<typeof openAI>;

const clientOptions: OpenAIClientParams = {
  apiKey: '123',
  model: 'gpt-4',
  completionCost: 0,
  tokenCost: 0,
  contextSize: 32768,
};

describe('OpenAI Client', () => {
  beforeAll(() => {
    OpenAI.mockReturnValue({
      chat: {
        completions: {
          create: completionCreateMock
        }
      },
      embeddings: {
        create: embeddingsCreateMock
      }
    } as any);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create an instance of OpenAIClient", () => {
      const client = new OpenAIClient(clientOptions);
      expect(client).toBeDefined();
      const params = OpenAI.mock.calls[0][0];
      expect(params).toEqual({ apiKey: clientOptions.apiKey });
    });
  });

  describe("getChatCompletion", () => {
    it("should call openai client completion function", async () => {
      completionCreateMock.mockResolvedValue({
        choices: [{
          message: {
            role: "assistant",
            content: "Paris",
          },
          finish_reason: "stop"
        }],
        usage: {
          completion_tokens: 0,
          prompt_tokens: 0,
          total_tokens: 0
        }
      } as ChatCompletion);
      const client = new OpenAIClient(clientOptions);
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
            functionCall: undefined,
            toolCalls: [],
          },
          finishReason: "stop"
        }],
        usage: {
          completionTokens: 0,
          promptTokens: 0,
          totalTokens: 0
        }
      });
      expect(completionCreateMock).toHaveBeenCalledWith({
        messages: messages,
        model: clientOptions.model,
        stream: false,
      });
    });
  });

  describe("getEmbeddings", () => {
    it("should call openai client embedding function", async () => {
      embeddingsCreateMock.mockResolvedValue({
        data: [
          {
            embedding: [0.1, 0.2, 0.3],
            index: 0
          }
        ],
        usage: {
          prompt_tokens: 0,
          total_tokens: 0
        }
      });
      const client = new OpenAIClient(clientOptions);
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
      expect(embeddingsCreateMock).toHaveBeenCalledWith({
        model: clientOptions.model,
        input: input
      });
    });
  });
})
;
