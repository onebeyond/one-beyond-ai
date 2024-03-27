import { mapChatCompletionOptions, mapFinishReason, mapMessage, mapResponseFormat, mapRole, mapUsage } from "./mappers";
import { ChatCompletionOptions } from "@one-beyond-ai/common";
import { ChatResponseMessage as AzureChatResponseMessage } from "@azure/openai/types/openai";

describe('Azure OpenAI mappers', () => {
  describe("mapChatCompletionOptions", () => {
    it("should map responseFormat to ChatCompletionsResponseFormat", () => {
      const options: ChatCompletionOptions = {
        responseFormat: "json"
      };
      const result = mapChatCompletionOptions(options);
      expect(result).toEqual({
        responseFormat: {
          type: "json_object"
        }
      });
    });
    it("should return undefined if options is undefined", () => {
      const result = mapChatCompletionOptions(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapUsage", () => {
    it("should map AzureCompletionsUsage to CompletionUsage", () => {
      const usage = {
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0
      };
      const result = mapUsage(usage);
      expect(result).toEqual(usage);
    });
    it("should return 0 if usage is undefined", () => {
      const result = mapUsage(undefined);
      expect(result).toEqual({
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0
      });
    });
  });

  describe("mapRole", () => {
    it("should map role to ChatRole", () => {
      const result = mapRole("user");
      expect(result).toEqual("user");
    });
    it("should return assistant if role is not in ChatRoles", () => {
      const result = mapRole("test");
      expect(result).toEqual("assistant");
    });
  });

  describe("mapMessage", () => {
    it("should map AzureChatResponseMessage to ChatResponseMessage", () => {
      const message: AzureChatResponseMessage = {
        role: "assistant",
        content: "Paris",
        functionCall: {
          name: "test",
          arguments: "test"
        },
        toolCalls: [{
          id: "test",
          type: "function",
          function: {
            name: "test",
            arguments: "test"
          }
        }]
      };
      const result = mapMessage(message);
      expect(result).toEqual(message);
    });
    it("should return undefined if message is undefined", () => {
      const result = mapMessage(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapFinishReason", () => {
    it("should map finishReason to CompletionFinishReason", () => {
      const result = mapFinishReason("stop");
      expect(result).toEqual("stop");
    });
    it("should return null if finishReason is not in CompletionFinishReasons", () => {
      const result = mapFinishReason("test");
      expect(result).toBeNull();
    });
  });

  describe("mapResponseFormat", () => {
    it("should map responseFormat to ChatCompletionsResponseFormat", () => {
      const result = mapResponseFormat("json");
      expect(result).toEqual({ type: "json_object" });
    });
    it("should map responseFormat to ChatCompletionsResponseFormat", () => {
      const result = mapResponseFormat("text");
      expect(result).toEqual({ type: "text" });
    });
    it("should return undefined if responseFormat is undefined", () => {
      const result = mapResponseFormat(undefined);
      expect(result).toBeUndefined();
    });
  });
});
