/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChatCompletionCreateParams,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionChunk
} from "openai/src/resources/chat/completions";
import {
  AudioTranscriptionResultVerboseJson,
  ChatCompletionOptions,
  ChatRequestAssistantMessage, ChatRequestFunctionMessage,
  ChatRequestMessage,
  ChatRequestSystemMessage, ChatRequestToolMessage,
  ChatRequestUserMessage, ChatResponseMessage, ChatRole, ChatRoles, CompletionUsage, EmbeddingUsage,
  FunctionCall,
  FunctionType
} from "@one-beyond-ai/common";

import { CompletionUsage as OpenAICompletionUsage } from "openai/src/resources/completions";
import { CreateEmbeddingResponse } from "openai/src/resources/embeddings";
import { ChatCompletionMessageToolCall } from "openai/resources";


export const mapChatRequestSystemMessage = (message: ChatRequestSystemMessage): ChatCompletionSystemMessageParam => {
  return {
    role: "system",
    content: message.content,
    name: message.name,
  };
}

export const mapChatRequestUserMessage = (message: ChatRequestUserMessage): ChatCompletionMessageParam => {
  return {
    role: "user",
    content: message.content,
    name: message.name,
  };
}

export const mapChatRequestAssistantMessage = (message: ChatRequestAssistantMessage): ChatCompletionMessageParam => {
  return {
    role: "assistant",
    content: message.content,
    name: message.name,
    function_call: message?.functionCall,
    tool_calls: message?.toolCalls,
  };
}

export const mapChatRequestFunctionMessage = (message: ChatRequestFunctionMessage): ChatCompletionMessageParam => {
  return {
    role: "function",
    content: message.content,
    name: message.name,
  };
}

export const mapChatRequestToolMessage = (message: ChatRequestToolMessage): ChatCompletionMessageParam => {
  return {
    role: "tool",
    content: message.content,
    tool_call_id: message.toolCallId,
  };
}

export const mapChatRequestMessages = (messages: ChatRequestMessage[]): ChatCompletionMessageParam[] => {
  return messages.map((message) => {
    switch (message.role) {
      case "system":
        return mapChatRequestSystemMessage(message);
      case "user":
        return mapChatRequestUserMessage(message);
      case "assistant":
        return mapChatRequestAssistantMessage(message);
      case "function":
        return mapChatRequestFunctionMessage(message);
      case "tool":
        return mapChatRequestToolMessage(message);
    }
  });
}

export const mapUsage = (usage?: OpenAICompletionUsage): CompletionUsage => {
  return {
    completionTokens: usage?.completion_tokens ?? 0,
    promptTokens: usage?.prompt_tokens ?? 0,
    totalTokens: usage?.total_tokens ?? 0
  };
}

export const mapRole = (role?: string): ChatRole => {
  if (ChatRoles.includes(role as ChatRole)) return role as ChatRole;
  return "assistant";
}

export const mapFunctionCall = (functionCall?: ChatCompletionChunk.Choice.Delta.FunctionCall | ChatCompletionMessage["function_call"]): ChatResponseMessage["functionCall"]  => {
  return {
    name: functionCall?.name || "",
    arguments: functionCall?.arguments || "",
  }
}

export const mapCompletionResponseMessage = (message?: ChatCompletionMessage | ChatCompletionChunk.Choice.Delta): ChatResponseMessage | undefined => {
  if (!message) {
    return undefined;
  }
  return {
    role: mapRole(message.role),
    content: message?.content || null,
    functionCall: mapFunctionCall(message?.function_call),
    toolCalls: (message?.tool_calls ?? []).map((toolCall: ChatCompletionMessageToolCall |ChatCompletionChunk.Choice.Delta.ToolCall) => ({
      id: toolCall?.id || "",
      type: FunctionType.FUNCTION,
      function: mapFunctionCall(toolCall.function) as FunctionCall,
    })),
  };
}

export const mapEmbeddingUsage = (usage: CreateEmbeddingResponse.Usage): EmbeddingUsage => {
  return {
    promptTokens: usage.prompt_tokens,
    totalTokens: usage.total_tokens,
  }
}

export const mapResponseFormat = (responseFormat?: ChatCompletionOptions["responseFormat"]): ChatCompletionCreateParams.ResponseFormat | undefined => {
  switch (responseFormat) {
    case 'json':
      return { type: 'json_object' };
    case 'text':
      return { type: 'text' };
  }
  return undefined;
}

export const mapChatCompletionOptions = (options?: ChatCompletionOptions): Omit<ChatCompletionCreateParams, "messages" | "model"> | undefined => {
  if (!options) return;
  return {
    functions: options.functions,
    function_call: options.functionCall,
    max_tokens: options.maxTokens,
    frequency_penalty: options.frequencyPenalty,
    presence_penalty: options.presencePenalty,
    stop: options.stop,
    temperature: options.temperature,
    top_p: options.topP,
    n: options.n,
    logit_bias: options.logitBias,
    response_format: mapResponseFormat(options.responseFormat),
    logprobs: options.logProbs ? true : undefined,
    tool_choice: options.toolChoice,
    tools: options.tools,
    user: options.user,
    seed: options.seed,
  }
}

export const mapAudioTranscriptionResultVerboseJson = (response: any): AudioTranscriptionResultVerboseJson => {
  return {
    text: response.text,
    task: response.task,
    language: response.language,
    duration: response.duration,
    segments: (response?.segments ?? []).map((segment: any) => {
      return {
        id: segment.id,
        start: segment.start,
        end: segment.end,
        text: segment.text,
        temperature: segment.temperature,
        avgLogprob: segment.avg_logprob,
        compressionRatio: segment.compression_ratio,
        noSpeechProb: segment.no_speech_prob,
        tokens: segment.tokens,
        seek: segment.seek,
      }
    }),
  }
}
