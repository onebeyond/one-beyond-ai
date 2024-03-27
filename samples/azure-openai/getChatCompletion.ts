import { AzureOpenAIClient } from "../../modules/azure-openai/src";

const client = new AzureOpenAIClient({
  apiKey: "YOUR_API_KEY",
  deploymentName: "YOUR_DEPLOYMENT_NAME",
  endpoint: "YOUR_ENDPOINT",
  version: "YOUR_VERSION",
  tokenCost: 0.06 / 1000,
  completionCost: 0.06 / 1000,
  contextSize: 32768,
});

const main = async (): Promise<string | undefined> => {
  const messages = [
    {
      role: "system",
      content: "You are a chatbot, which gives basic information.",
    },
    {
      role: "user",
      content: "What is the capital of France?",
    },
  ];
  const result = await client.getChatCompletion(messages, {
    maxTokens: 1024,
    temperature: 0,
    topP: 0,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });
  return result.choices[0]?.message?.content;
}

main().then(console.log).catch(console.error);
