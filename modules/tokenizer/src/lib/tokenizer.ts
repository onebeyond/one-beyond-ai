import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { encodingForModel } from 'js-tiktoken';
import { TokenizerModel, assertIsModelTiktokenSupported } from '@one-beyond-ai/common';

const DEFAULT_MODEL = 'gpt-3.5-turbo';
const NEW_GENERATION_MODELS = ["text-embedding-3-small", "text-embedding-3-large"];

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
  ): Promise<Document<Record<string, any>>[]> {
    const lengthFunction = async (text: string) => (await this.createTokens(text)).length;

    const recSplitter = new RecursiveCharacterTextSplitter({
      ...(this.splitSeparator ? { separator: this.splitSeparator } : {}),
      chunkSize: this.splitChunkSize,
      chunkOverlap: this.splitChunkOverlap,
      lengthFunction,
    });
    return recSplitter.createDocuments([content]);
  }

  public async createTokens(content: string): Promise<number[]> {
    // since 'text-embedding-3-small' and 'text-embedding-3-large' are not supported by js-tiktoken, but
    // clk 100 based models are, we use ada 2 as a fallback
    const model = NEW_GENERATION_MODELS.includes(this.model) ? 'text-embedding-ada-002' : this.model;
    assertIsModelTiktokenSupported(model);
    const encoder = encodingForModel(model);
    return encoder.encode(content);
  }

  public async getDocTokens(content: string): Promise<number[][]> {
    const splittedContent = await this.splitDocument(content);
    return Promise.all(splittedContent.map((sc) => this.createTokens(sc.pageContent)));
  }
}
