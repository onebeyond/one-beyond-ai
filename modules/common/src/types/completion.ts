export enum ChatRole {
  "SYSTEM" = "system",
  "USER" = "user",
  "ASSISTANT" = "assistant",
  "FUNCTION" = "function"
}

export type ChatRequestMessageBase<T> = {
  role: T,
  content: string,
  name?: string
}
export type ChatRequestSystemMessage = ChatRequestMessageBase<ChatRole.SYSTEM>;
export type ChatRequestUserMessage = ChatRequestMessageBase<ChatRole.USER>;
export type ChatRequestAssistantMessage = ChatRequestMessageBase<ChatRole.ASSISTANT> & {
  functionCall?: FunctionCall
};
export type ChatRequestFunctionMessage = ChatRequestMessageBase<ChatRole.FUNCTION> & {
  name: string
};
export type ChatRequestMessage =
  ChatRequestSystemMessage
  | ChatRequestUserMessage
  | ChatRequestAssistantMessage
  | ChatRequestFunctionMessage;

export type FunctionCall = {
  name: string,
  arguments: string
};

export type ChatResponseMessage = {
  role: ChatRole,
  content: string | null,
  functionCall?: FunctionCall
};

export type CompletionUsage = {
  completionTokens: number;
  promptTokens: number;
  totalTokens: number;
}

export enum CompletionsFinishReason {
  "STOP" = "stop",
  "LENGTH" = "length",
  "CONTENT_FILTER" = "content_filter",
  "FUNCTION_CALL" = "function_call"
}
export type ChatChoice = {
  message?: ChatResponseMessage;
  delta?: ChatResponseMessage;
  finishReason: CompletionsFinishReason | null;
}
export type ChatCompletion = {
  choices: ChatChoice[];
  usage: CompletionUsage;
};
