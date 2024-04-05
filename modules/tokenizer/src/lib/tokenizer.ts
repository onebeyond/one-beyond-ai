import { Document } from 'langchain/document';
import { CharacterTextSplitter } from 'langchain/text_splitter';

import { Tiktoken } from 'tiktoken/lite';
import { load } from 'tiktoken/load';

import registry from 'tiktoken/registry.json';
import models from 'tiktoken/model_to_encoding.json';

type TokenizerParams = {
  splitSeparator?: string;
  splitChunkSize?: number;
  splitChunkOverlap?: number;
  model?: string;
};

export class Tokenizer {
  private splitSeparator;
  private splitChunkSize;
  private splitChunkOverlap;
  private model;

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

  public async createTokens(content: string): Promise<Uint32Array> {
    const modelsDic = models as { [key: string]: string };
    const registryDic = registry as { [key: string]: Parameters<typeof load>[0] };

    const model = await load(registryDic[modelsDic[this.model]]);
    const encoder = new Tiktoken(model.bpe_ranks, model.special_tokens, model.pat_str);
    const tokens = encoder.encode(content);

    encoder.free();

    return tokens;
  }

  public async getDocTokens(content: string): Promise<Uint32Array[]> {
    const splittedContent = await this.docSplitter(content);
    return Promise.all(splittedContent.map((sc) => this.createTokens(sc.pageContent)));
  }
}
