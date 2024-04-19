import { Document } from 'langchain/document';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { encodingForModel } from "js-tiktoken";
import { TokenizerModel } from "@one-beyond-ai/common";

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
    this.splitSeparator = params?.splitSeparator ?? '\n';
    this.splitChunkSize = params?.splitChunkSize ?? 100;
    this.splitChunkOverlap = params?.splitChunkOverlap ?? 3;
  }

  public async splitDocument(content: string): Promise<Document<Record<string, any>>[]> {
    const splitter = new CharacterTextSplitter({
      separator: this.splitSeparator,
      chunkSize: this.splitChunkSize,
      chunkOverlap: this.splitChunkOverlap,
    });
    return splitter.createDocuments([content]);
  }

  public async createTokens(content: string, model: TokenizerModel = DEFAULT_MODEL): Promise<number[]> {
    const encoder = encodingForModel(model);
    return encoder.encode(content);
  }

  public async getDocTokens(content: string, model: TokenizerModel = DEFAULT_MODEL): Promise<number[][]> {
    const splittedContent = await this.splitDocument(content);
    return Promise.all(splittedContent.map((sc) => this.createTokens(sc.pageContent, model)));
  }
}
