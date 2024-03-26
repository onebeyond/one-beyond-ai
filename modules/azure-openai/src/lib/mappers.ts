import {
  ChatCompletionOptions,
  ChatResponseMessage,
  ChatRole, ChatRoles,
  CompletionFinishReason, CompletionFinishReasons,
  CompletionUsage
} from "@one-beyond-ai/common";
import {
  CompletionsUsage as AzureCompletionsUsage,
  ChatResponseMessage as AzureChatResponseMessage, GetChatCompletionsOptions
} from "@azure/openai/types/openai";
import { ChatCompletionsResponseFormat } from "@azure/openai/types/src/models/models";

export const mapUsage = (usage?: AzureCompletionsUsage): CompletionUsage => {
  return {
    completionTokens: usage?.completionTokens ?? 0,
    promptTokens: usage?.promptTokens ?? 0,
    totalTokens: usage?.totalTokens ?? 0
  };
}

export const mapRole = (role: string): ChatRole => {
  if (ChatRoles.includes(role as ChatRole)) return role as ChatRole;
  return "assistant";
}

export const mapMessage = (message?: AzureChatResponseMessage): ChatResponseMessage | undefined => {
  if (!message) {
    return undefined;
  }
  return {
    role: mapRole(message.role),
    content: message.content,
    functionCall: message.functionCall,
    toolCalls: message.toolCalls
  };
}

export const mapFinishReason = (finishReason: string | null): CompletionFinishReason | null => {
  if (CompletionFinishReasons.includes(finishReason as CompletionFinishReason)) return finishReason as CompletionFinishReason;
  return null;
}

export const mapResponseFormat = (responseFormat?: ChatCompletionOptions["responseFormat"]): ChatCompletionsResponseFormat | undefined => {
  switch (responseFormat) {
    case 'json':
      return { type: 'json_object' };
    case 'text':
      return { type: 'text' };
  }
  return undefined;
}

export const mapChatCompletionOptions = (options?: ChatCompletionOptions): GetChatCompletionsOptions | undefined => {
  if (!options) return undefined;
  return {
    ...options,
    responseFormat: mapResponseFormat(options?.responseFormat),
  }
}
