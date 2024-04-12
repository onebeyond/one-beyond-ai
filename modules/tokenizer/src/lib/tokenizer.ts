import { Document } from 'langchain/document';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { encodingForModel } from "js-tiktoken";
import { TokenizerModel } from "@one-beyond-ai/common";

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
  private model: TokenizerModel;

  constructor(params?: TokenizerParams) {
    this.splitSeparator = params?.splitSeparator ?? '\n';
    this.splitChunkSize = params?.splitChunkSize ?? 100;
    this.splitChunkOverlap = params?.splitChunkOverlap ?? 3;
    this.model = params?.model ?? 'gpt-3.5-turbo';
  }

  public async docSplitter(content: string): Promise<Document<Record<string, any>>[]> {
    const splitter = new CharacterTextSplitter({
      separator: this.splitSeparator,
      chunkSize: this.splitChunkSize,
      chunkOverlap: this.splitChunkOverlap,
    });

    return splitter.createDocuments([content]);
  }

  public async createTokens(content: string): Promise<number[]> {
    const encoder = encodingForModel(this.model);
    return encoder.encode(content);
  }

  public async getDocTokens(content: string): Promise<number[][]> {
    const splittedContent = await this.docSplitter(content);
    return Promise.all(splittedContent.map((sc) => this.createTokens(sc.pageContent)));
  }
}
