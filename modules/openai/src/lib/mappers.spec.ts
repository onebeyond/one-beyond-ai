import { describe, expect } from "vitest";
import * as mappers from "./mappers";
import {
  ChatCompletionOptions,
  ChatRequestAssistantMessage,
  ChatRequestFunctionMessage,
  ChatRequestSystemMessage,
  ChatRequestToolMessage,
  ChatRequestUserMessage
} from "@one-beyond-ai/common";
import { ChatCompletionMessage } from "openai/src/resources/chat/completions";

describe("OpenAI Mappers", () => {
  describe("mapChatRequestMessages", () => {
    it("should map ChatRequestSystemMessage to ChatCompletionSystemMessageParam", () => {
      const message: ChatRequestSystemMessage = {
        role: "system",
        content: "Hello",
        name: "system"
      };
      const result = mappers.mapChatRequestMessages([message]);
      expect(result).toEqual([{
        role: "system",
        content: "Hello",
        name: "system"
      }]);
    });

    it("should map ChatRequestUserMessage to ChatCompletionMessageParam", () => {
      const message: ChatRequestUserMessage = {
        role: "user",
        content: "Hello",
        name: "user"
      };
      const result = mappers.mapChatRequestMessages([message]);
      expect(result).toEqual([{
        role: "user",
        content: "Hello",
        name: "user"
      }]);
    });

    it("should map ChatRequestAssistantMessage to ChatCompletionMessageParam", () => {
      const message: ChatRequestAssistantMessage = {
        role: "assistant",
        content: "Hello",
        name: "assistant",
        functionCall: {
          name: "call",
          arguments: "arg"
        },
        toolCalls: [{
          type: "function",
          function: {
            name: "call",
            arguments: "arg"
          },
          id: "id"
        }]
      };
      const result = mappers.mapChatRequestMessages([message]);
      expect(result).toEqual([{
        role: "assistant",
        content: "Hello",
        name: "assistant",
        function_call: {
          name: "call",
          arguments: "arg"
        },
        tool_calls: [{
          type: "function",
          function: {
            name: "call",
            arguments: "arg"
          },
          id: "id"
        }]
      }]);
    });
    it("should map ChatRequestFunctionMessage to ChatCompletionMessageParam", () => {
      const message: ChatRequestFunctionMessage = {
        role: "function",
        content: "Hello",
        name: "function"
      };
      const result = mappers.mapChatRequestMessages([message]);
      expect(result).toEqual([{
        role: "function",
        content: "Hello",
        name: "function"
      }]);
    });
    it("should map ChatRequestToolMessage to ChatCompletionMessageParam", () => {
      const message: ChatRequestToolMessage = {
        role: "tool",
        content: "Hello",
        toolCallId: "id"
      };
      const result = mappers.mapChatRequestMessages([message]);
      expect(result).toEqual([{
        role: "tool",
        content: "Hello",
        tool_call_id: "id"
      }]);
    });
  });

  describe("mapUsage", () => {
    it("should map OpenAICompletionUsage to CompletionUsage", () => {
      const usage = {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0
      };
      const result = mappers.mapUsage(usage);
      expect(result).toEqual({
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0
      });
    });
  });

  describe("mapRole", () => {
    it("should map role to ChatRole", () => {
      const result = mappers.mapRole("system");
      expect(result).toEqual("system");
    });
    it("should map not supported role to assistant", () => {
      const result = mappers.mapRole("test");
      expect(result).toEqual("assistant");
    });
  });

  describe("mapCompletionResponseMessage", () => {
    it("should map ChatCompletionMessage to ChatResponseMessage", () => {
      const message: ChatCompletionMessage = {
        role: "assistant",
        content: "Hello",
        function_call: {
          name: "call",
          arguments: "arg"
        },
        tool_calls: [{
          type: "function",
          function: {
            name: "call",
            arguments: "arg"
          },
          id: "id"
        }]
      };
      const result = mappers.mapCompletionResponseMessage(message);
      expect(result).toEqual({
        role: "assistant",
        content: "Hello",
        functionCall: {
          name: "call",
          arguments: "arg"
        },
        toolCalls: [{
          type: "function",
          function: {
            name: "call",
            arguments: "arg"
          },
          id: "id"
        }]
      });
    });
    it("should return undefined if message is undefined", () => {
      const result = mappers.mapCompletionResponseMessage(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapEmbeddingUsage", () => {
    it("should map CreateEmbeddingResponse.Usage to EmbeddingUsage", () => {
      const usage = {
        prompt_tokens: 0,
        total_tokens: 0
      };
      const result = mappers.mapEmbeddingUsage(usage);
      expect(result).toEqual({
        promptTokens: 0,
        totalTokens: 0
      });
    });
  });

  describe("mapResponseFormat", () => {
    it("should map json response format", () => {
      const result = mappers.mapResponseFormat("json");
      expect(result).toEqual({ type: "json_object" });
    });
    it("should map text response format", () => {
      const result = mappers.mapResponseFormat("text");
      expect(result).toEqual({ type: "text" });
    });
    it("should return undefined if response format is undefined", () => {
      const result = mappers.mapResponseFormat(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("mapChatCompletionOptions", () => {
    it("should map ChatCompletionOptions to ChatCompletionCreateParams", () => {
      const options: ChatCompletionOptions = {
        maxTokens: 100,
        temperature: 0.5,
        responseFormat: "json",
        presencePenalty: 0.5,
        frequencyPenalty: 0.5,
        topP: 0.5,
        n: 1,
        logitBias: { "Hello": 1 },
        stop: ["Hello"],
        user: "user",
        seed: 1,
        functionCall: {
          name: "call",
        },
        toolChoice: "auto",
        functions: [{
          name: "call",
          description: "description",
          parameters: {}
        }],
        logProbs: 0.5,
        echo: true,
        bestOf: 1,
        tools: [{
          type: "function",
          function: {
            name: "call",
            description: "description",
            parameters: {}
          }
        }]
      };
      const result = mappers.mapChatCompletionOptions(options);
      expect(result).toEqual({
        max_tokens: 100,
        temperature: 0.5,
        response_format: { type: "json_object" },
        presence_penalty: 0.5,
        frequency_penalty: 0.5,
        top_p: 0.5,
        n: 1,
        logit_bias: { "Hello": 1 },
        stop: ["Hello"],
        user: "user",
        seed: 1,
        function_call: {
          name: "call",
        },
        tool_choice: "auto",
        functions: [{
          name: "call",
          description: "description",
          parameters: {}
        }],
        logprobs: true,
        tools: [{
          type: "function",
          function: {
            name: "call",
            description: "description",
            parameters: {}
          }
        }]
      });
    });
  });

  describe("mapAudioTranscriptionResultVerboseJson", () => {
    it("should map OpenAI response to AudioTranscriptionResultVerboseJson", () => {
      const input = {
        text: "Hello",
        task: "task",
        language: "en",
        duration: 1,
        segments: [{
          id: 1,
          start: 0,
          end: 1,
          speaker: "speaker",
          text: "Hello",
          temperature: 0.5,
          avg_logprob: 0.5,
          compression_ratio: 0.5,
          no_speech_prob: 0.5,
          tokens: [1],
          seek: 0
        }]
      };
      const result = mappers.mapAudioTranscriptionResultVerboseJson(input);
      expect(result).toEqual({
        text: "Hello",
        task: "task",
        language: "en",
        duration: 1,
        segments: [{
          id: 1,
          start: 0,
          end: 1,
          text: "Hello",
          temperature: 0.5,
          avgLogprob: 0.5,
          compressionRatio: 0.5,
          noSpeechProb: 0.5,
          tokens: [1],
          seek: 0
        }]
      });
    });
  });
});
