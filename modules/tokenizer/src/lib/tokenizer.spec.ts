import { Tokenizer } from './tokenizer';

const content = `
LangChain is a framework for developing applications powered by language models. It enables applications that:

Are context-aware: connect a language model to sources of context (prompt instructions, few shot examples, content to ground its response in, etc.)
Reason: rely on a language model to reason (about how to answer based on provided context, what actions to take, etc.)
This framework consists of several parts.

LangChain Libraries: The Python and JavaScript libraries. Contains interfaces and integrations for a myriad of components, a basic run time for combining these components into chains and agents, and off-the-shelf implementations of chains and agents.
LangChain Templates: A collection of easily deployable reference architectures for a wide variety of tasks. (Python only)
LangServe: A library for deploying LangChain chains as a REST API. (Python only)
LangSmith: A developer platform that lets you debug, test, evaluate, and monitor chains built on any LLM framework and seamlessly integrates with LangChain.
`;

describe('tokenizer', () => {
  it('docSplitter work correctly', async () => {
    const tokenizer = new Tokenizer();

    const result = await tokenizer.docSplitter(content);

    expect(result.length).toEqual(8);
    expect(result[0].pageContent).toEqual(
      'LangChain is a framework for developing applications powered by language models. It enables applications that:'
    );
  });

  it('createTokens work correctly', async () => {
    const tokenizer = new Tokenizer();
    const result = await tokenizer.createTokens('hello world');
    expect(result).toEqual([15339, 1917]);
  });

  it('getDocTokens work correctly', async () => {
    const tokenizer = new Tokenizer();
    const result = await tokenizer.getDocTokens(content);
    expect(result.length).toEqual(8);
  });
});
