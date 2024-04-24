import {
  AIClient,
  concurrentRunner,
  Embedding,
  EmbeddingCost,
  EmbeddingOptions,
  ExtractedPage,
  FileType
} from "@one-beyond-ai/common";
import { Cost } from "@one-beyond-ai/cost";
import { TextExtractor } from "@one-beyond-ai/text-document-extractor";
import { Tokenizer } from "@one-beyond-ai/tokenizer";
import { ReadStream } from "fs";
import { Readable } from "stream";

export type EmbedOptions = {
  concurrency?: number;
  splitSeparator?: string;
  splitChunkSize?: number;
  splitChunkOverlap?: number;
  textExtractor?: TextExtractor;
  tokenizer?: Tokenizer;
}

const defaultOptions: EmbedOptions = {
  concurrency: 1,
  splitSeparator: '\n',
  splitChunkSize: 10000,
  splitChunkOverlap: 1000,
}

export type Chunk = {
  text: string;
}

export type EmbeddingResult = Embedding & {
  cost: EmbeddingCost;
}

export class Embed {
  private readonly cost: Cost;
  private readonly tokenizer: Tokenizer;
  private readonly textExtractor: TextExtractor;

  constructor(private client: AIClient, private options = defaultOptions) {
    this.cost = new Cost(this.client);
    this.tokenizer = options?.tokenizer ?? new Tokenizer({
      splitSeparator: this.options?.splitSeparator,
      splitChunkSize: this.options?.splitChunkSize,
      splitChunkOverlap: this.options?.splitChunkOverlap,
      model: this.client.options.tokenizerModel,
    });
    this.textExtractor = options?.textExtractor ?? new TextExtractor();
  }

  public async embed<T extends Chunk>(chunk: T, options?: EmbeddingOptions): Promise<T & EmbeddingResult> {
    const result = await this.client.getEmbeddings([chunk.text], options);
    const cost = this.cost.getEmbeddingCost(result);
    return {
      ...chunk,
      ...result,
      cost,
    }
  }

  public async chunkText<T extends Chunk>(obj: T): Promise<T[]> {
    const contents = await this.tokenizer.splitDocument(obj.text);
    return contents.map((sc) => ({ ...obj, text: sc.text }));
  }

  public async embedChunks<T extends Chunk>(chunks: T[], options?: EmbeddingOptions): Promise<Array<T & EmbeddingResult>> {
    const promises = chunks.map((chunk) => async () => this.embed(chunk, options));
    return concurrentRunner(promises, this.options?.concurrency ?? 1);
  }

  public async getChunks(readable: Readable, fileType: FileType): Promise<ExtractedPage[][]> {
    const document = await this.textExtractor.extractText(readable, fileType);
    return Promise.all(document.pages.map((page) => this.chunkText(page)));
  }

  public async embedDocument(stream: ReadStream, fileType: FileType, options?: EmbeddingOptions): Promise<Array<ExtractedPage & EmbeddingResult>> {
    const chunks = await this.getChunks(stream, fileType);
    return this.embedChunks(chunks.flat(), options);
  }

  public async embedText(input: string, options?: EmbeddingOptions): Promise<Array<EmbeddingResult & {
    text: string
  }>> {
    const chunks = await this.chunkText({ text: input });
    return this.embedChunks(chunks, options);
  }

  public async getDocumentCostEstimation(stream: ReadStream, fileType: FileType): Promise<EmbeddingCost> {
    const document = await this.textExtractor.extractText(stream, fileType);
    const text = document.pages.map((page) => page.text).join('\n');
    return this.getTextCostEstimation(text);
  }

  public async getTextCostEstimation(input: string): Promise<EmbeddingCost> {
    const tokens = await this.tokenizer.getDocTokens(input);
    const tokenCount = tokens.reduce((acc, t) => acc + t.length, 0);
    const cost = this.cost.getTokenCost(tokenCount);
    return { token: cost, total: cost, currency: this.client.options.currency ?? '' };
  }
}
