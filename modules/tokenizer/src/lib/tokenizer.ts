import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { encodingForModel } from 'js-tiktoken';
import { TokenizerDocument, TokenizerModel, assertIsModelTiktokenSupported, NewGenerationTokenizerModels } from '@one-beyond-ai/common';

const DEFAULT_MODEL = 'gpt-3.5-turbo';

type TokenizerParams = {
  splitSeparator?: string;
  splitChunkSize?: number;
  splitChunkOverlap?: number;
  model?: TokenizerModel;
};

export class Tokenizer {
  private splitSeparator;
  private splitChunkSize;
  private splitChunkOverlap;
  private model;

  constructor(params?: TokenizerParams) {
    this.splitSeparator = params?.splitSeparator;
    this.splitChunkSize = params?.splitChunkSize ?? 100;
    this.splitChunkOverlap = params?.splitChunkOverlap ?? 3;
    this.model = params?.model ?? DEFAULT_MODEL;
  }

  public async splitDocument(
    content: string,
    originalDocument?: string
  ): Promise<TokenizerDocument[]> {
    const lengthFunction = async (text: string) => (await this.createTokens(text)).length;

    const recSplitter = new RecursiveCharacterTextSplitter({
      ...(this.splitSeparator ? { separator: this.splitSeparator } : {}),
      chunkSize: this.splitChunkSize,
      chunkOverlap: this.splitChunkOverlap,
      lengthFunction,
    });
    const documents = await recSplitter.createDocuments([content]);
    return documents.map((doc) => {
      return {
      ...doc,
      text: doc.pageContent,
      metadata: {
        ...doc.metadata,
        originalDocument,
      },
    }});
  }

  public async createTokens(content: string): Promise<number[]> {
    // since 'text-embedding-3-small' and 'text-embedding-3-large' are not supported by js-tiktoken, but
    // clk 100 based models are, we use ada 2 as a fallback
    const model = NewGenerationTokenizerModels.includes(this.model) ? 'text-embedding-ada-002' : this.model;
    assertIsModelTiktokenSupported(model);
    const encoder = encodingForModel(model);
    return encoder.encode(content);
  }

  public async getDocTokens(content: string): Promise<number[][]> {
    const splittedContent = await this.splitDocument(content);
    return Promise.all(splittedContent.map((sc) => this.createTokens(sc.text)));
  }
}
