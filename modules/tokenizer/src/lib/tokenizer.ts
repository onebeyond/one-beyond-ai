import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { encodingForModel } from 'js-tiktoken';
import { TokenizerModel } from '@one-beyond-ai/common';

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

  constructor(params?: TokenizerParams) {
    this.splitSeparator = params?.splitSeparator;
    this.splitChunkSize = params?.splitChunkSize ?? 100;
    this.splitChunkOverlap = params?.splitChunkOverlap ?? 3;
  }

  public async splitDocument(
    content: string,
    model: TokenizerModel = DEFAULT_MODEL
  ): Promise<Document<Record<string, any>>[]> {
    const lengthFunction = async (text: string) => (await this.createTokens(text, model)).length;

    const recSplitter = new RecursiveCharacterTextSplitter({
      ...(this.splitSeparator ? { separator: this.splitSeparator } : {}),
      chunkSize: this.splitChunkSize,
      chunkOverlap: this.splitChunkOverlap,
      lengthFunction,
    });
    return recSplitter.createDocuments([content]);
  }

  public async createTokens(content: string, model: TokenizerModel = DEFAULT_MODEL): Promise<number[]> {
    const encoder = encodingForModel(model);
    return encoder.encode(content);
  }

  public async getDocTokens(content: string, model: TokenizerModel = DEFAULT_MODEL): Promise<number[][]> {
    const splittedContent = await this.splitDocument(content, model);
    return Promise.all(splittedContent.map((sc) => this.createTokens(sc.pageContent, model)));
  }
}
