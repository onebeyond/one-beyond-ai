/* eslint-disable @typescript-eslint/no-explicit-any */
export const ChatRoles = ["system", "user", "assistant", "function", "tool"] as const;
export type ChatRole = typeof ChatRoles[number];

export const CompletionFinishReasons = ["stop", "length", "content_filter", "function_call", "tool_calls"] as const;
export type CompletionFinishReason = typeof CompletionFinishReasons[number];

export enum FunctionType {
  FUNCTION = "function",
}

export type ChatCompletionsFunctionToolCall = {
  type: FunctionType.FUNCTION;
  function: FunctionCall;
  id: string;
}

export type ChatRequestSystemMessage = {
  role: "system";
  content: string;
  name?: string;
};
export type ChatRequestUserMessage = {
  role: "user";
  content: string;
  name?: string;
};
export type ChatRequestAssistantMessage = {
  role: "assistant";
  content: string;
  name?: string;
  functionCall?: FunctionCall;
  toolCalls?: ChatCompletionsFunctionToolCall[];
};
export type ChatRequestFunctionMessage = {
  role: "function";
  content: string;
  name: string;
};
export type ChatRequestToolMessage = {
  role: "tool";
  content: string;
  toolCallId: string;
};

export type ChatRequestMessage =
  ChatRequestSystemMessage
  | ChatRequestUserMessage
  | ChatRequestAssistantMessage
  | ChatRequestFunctionMessage
  | ChatRequestToolMessage;

export type FunctionCall = {
  name: string,
  arguments: string
};

export type ChatResponseMessage = {
  role: ChatRole;
  content: string | null;
  functionCall?: FunctionCall;
  toolCalls: ChatCompletionsFunctionToolCall[];
};

export type CompletionUsage = {
  completionTokens: number;
  promptTokens: number;
  totalTokens: number;
};

export type ChatChoice = {
  message?: ChatResponseMessage;
  delta?: ChatResponseMessage;
  finishReason: CompletionFinishReason | null;
}
export type ChatCompletion = {
  choices: ChatChoice[];
  usage: CompletionUsage;
};

export type FunctionDefinition = {
  name: string;
  description?: string;
  parameters: Record<string, any>;
}

export type ChatCompletionsFunctionToolDefinition = {
  type: "function";
  function: FunctionDefinition;
}

export type ChatCompletionsToolDefinition = ChatCompletionsFunctionToolDefinition;

export type ChatCompletionsToolSelectionPreset = "auto" | "none";
export type ChatCompletionsNamedFunctionToolSelection = {
  type: "function";
  function: {
    name: string;
  };
}
export type ChatCompletionsNamedToolSelection =
  ChatCompletionsToolSelectionPreset
  | ChatCompletionsNamedFunctionToolSelection;
export type FunctionCallPreset = "auto" | "none";

export interface FunctionName {
  name: string;
}

export type ChatCompletionOptions = {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  n?: number;
  logitBias?: Record<string, number>;
  presencePenalty?: number;
  frequencyPenalty?: number;
  responseFormat?: "json" | "text";
  user?: string;
  stop?: string[];
  seed?: number;
  logProbs?: number;
  echo?: boolean;
  bestOf?: number;
  tools?: ChatCompletionsToolDefinition[];
  toolChoice?: ChatCompletionsNamedToolSelection;
  functions?: FunctionDefinition[];
  functionCall?: FunctionCallPreset | FunctionName;
}
