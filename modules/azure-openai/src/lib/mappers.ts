import {
  ChatCompletionOptions,
  ChatCompletionsFunctionToolCall,
  ChatResponseMessage,
  ChatRole,
  ChatRoles,
  CompletionFinishReason,
  CompletionFinishReasons,
  CompletionUsage,
} from '@one-beyond-ai/common';
import {
  CompletionsUsage as AzureCompletionsUsage,
  GetChatCompletionsOptions,
  ChatCompletionsResponseFormat,
  ChatResponseMessage as AzureChatResponseMessage,
} from '@azure/openai';

export const mapUsage = (usage?: AzureCompletionsUsage): CompletionUsage => {
  return {
    completionTokens: usage?.completionTokens ?? 0,
    promptTokens: usage?.promptTokens ?? 0,
    totalTokens: usage?.totalTokens ?? 0,
  };
};

export const mapRole = (role: string): ChatRole => {
  if (ChatRoles.includes(role as ChatRole)) return role as ChatRole;
  return 'assistant';
};

export const mapMessage = (message?: AzureChatResponseMessage): ChatResponseMessage | undefined => {
  if (!message) {
    return undefined;
  }
  return {
    role: mapRole(message.role),
    content: message.content,
    functionCall: message.functionCall,
    toolCalls: (message.toolCalls as unknown as ChatCompletionsFunctionToolCall[]) ?? [],
  };
};

export const mergeToolCalls = (toolCalls: ChatCompletionsFunctionToolCall[], delta: ChatResponseMessage) =>
  toolCalls.length > 0
    ? toolCalls.map((toolCall, i) => ({
        function: {
          name: toolCall.function.name,
          arguments: toolCall.function.arguments + (delta.toolCalls[i]?.function.arguments ?? ''),
        },
        id: toolCall.id,
        type: toolCall.type,
      }))
    : delta.toolCalls;

export const mapMessageFromStream = (
  messageAccumulator: ChatResponseMessage | undefined,
  delta: AzureChatResponseMessage
): ChatResponseMessage | undefined => {
  const mappedDelta = mapMessage(delta);
  if (!mappedDelta) return messageAccumulator;
  return {
    role: mappedDelta?.role ?? messageAccumulator?.role,
    content: messageAccumulator?.content
      ? messageAccumulator?.content + (mappedDelta?.content ?? '')
      : mappedDelta?.content ?? '',
    functionCall: mappedDelta?.functionCall,
    toolCalls: mergeToolCalls(messageAccumulator?.toolCalls ?? [], mappedDelta),
  };
};

export const mapFinishReason = (finishReason: string | null): CompletionFinishReason | null => {
  if (CompletionFinishReasons.includes(finishReason as CompletionFinishReason))
    return finishReason as CompletionFinishReason;
  return null;
};

export const mapResponseFormat = (
  responseFormat?: ChatCompletionOptions['responseFormat']
): ChatCompletionsResponseFormat | undefined => {
  switch (responseFormat) {
    case 'json':
      return { type: 'json_object' };
    case 'text':
      return { type: 'text' };
  }
  return undefined;
};

export const mapChatCompletionOptions = (options?: ChatCompletionOptions): GetChatCompletionsOptions | undefined => {
  if (!options) return undefined;
  return {
    ...options,
    responseFormat: mapResponseFormat(options?.responseFormat),
  };
};
