import { Mocked, MockedClass } from "vitest";
import { AIClient } from "@one-beyond-ai/common";
import { Cost } from "@one-beyond-ai/cost";
import { Embed, } from './embed';
import { Tokenizer } from "@one-beyond-ai/tokenizer";
import { TextExtractor } from "@one-beyond-ai/text-document-extractor";
import { PassThrough } from "stream";
import { ReadStream } from "fs";

vi.mock("@one-beyond-ai/cost");
vi.mock("@one-beyond-ai/tokenizer");
vi.mock("@one-beyond-ai/text-document-extractor");

const CostMock: MockedClass<typeof Cost> = Cost as MockedClass<typeof Cost>;
const TokenizerMock: MockedClass<typeof Tokenizer> = Tokenizer as MockedClass<typeof Tokenizer>;
const TextExtractorMock: MockedClass<typeof TextExtractor> = TextExtractor as MockedClass<typeof TextExtractor>;

const getStream = () => {
  const stream = new PassThrough();
  stream.write("Hello");
  stream.end();
  return stream as unknown as ReadStream;
}

describe('Embed module', () => {
  const client = {
    options: {
      currency: "USD",
      tokenizerModel: "gpt-4",
    },
    getEmbeddings: vi.fn(),
  } as unknown as Mocked<AIClient>;
  const embed = new Embed(client);

  beforeEach(() => {
    vi.clearAllMocks();
    CostMock.prototype.getTokenCost.mockReturnValue(0.1);
    CostMock.prototype.getEmbeddingCost.mockReturnValue({ token: 0.1, total: 0.1, currency: "USD" });
    TokenizerMock.prototype.splitDocument.mockImplementation((text: string) => [{ text }] as any);
    TokenizerMock.prototype.getDocTokens.mockResolvedValue([new Uint32Array([1, 2, 3])]);
    TextExtractorMock.prototype.extractText.mockResolvedValue({ pages: [{ text: "Hello World", pageNumber: 1 }] });
  });

  it("should call embedding and cost module", async () => {
    client.getEmbeddings.mockResolvedValue({
      data: [{ embedding: [1, 2, 3], index: 0 }],
      usage: { promptTokens: 1, totalTokens: 3 }
    });
    const result = await embed.embed({ text: "Hello" }, { user: "user", model: "model" });
    expect(result).toEqual({
      text: "Hello",
      data: [{ embedding: [1, 2, 3], index: 0 }],
      usage: { promptTokens: 1, totalTokens: 3 },
      cost: { token: 0.1, total: 0.1, currency: "USD" }
    });
    expect(client.getEmbeddings).toHaveBeenCalledWith(["Hello"], { user: "user", model: "model" });
    expect(CostMock.prototype.getEmbeddingCost).toHaveBeenCalledWith({
      data: [{ embedding: [1, 2, 3], index: 0 }],
      usage: { promptTokens: 1, totalTokens: 3 }
    });
  });

  it("should chunk text", async () => {
    const result = await embed.chunkText({ text: "Hello World", key: "key" });
    expect(result).toEqual([{ text: "Hello World", key: "key" }]);
    expect(TokenizerMock.prototype.splitDocument).toHaveBeenCalledWith("Hello World");
  });

  it("should embed chunks", async () => {
    const result = await embed.embedChunks([{ text: "Hello World", key: "key" }]);
    expect(result).toEqual([{
      text: "Hello World",
      key: "key",
      data: [{ embedding: [1, 2, 3], index: 0 }],
      usage: { promptTokens: 1, totalTokens: 3 },
      cost: { token: 0.1, total: 0.1, currency: "USD" }
    }]);
  });

  it("should embed a document", async () => {
    const stream = getStream();
    const result = await embed.embedDocument(stream, "txt");
    expect(result).toEqual([{
      text: "Hello World",
      pageNumber: 1,
      data: [{ embedding: [1, 2, 3], index: 0 }],
      usage: { promptTokens: 1, totalTokens: 3 },
      cost: { token: 0.1, total: 0.1, currency: "USD" }
    }]);
    expect(TextExtractorMock.prototype.extractText).toHaveBeenCalledWith(stream, "txt");
  });

  it("should embed text", async () => {
    const result = await embed.embedText("Hello World");
    expect(result).toEqual([{
      text: "Hello World",
      data: [{ embedding: [1, 2, 3], index: 0 }],
      usage: { promptTokens: 1, totalTokens: 3 },
      cost: { token: 0.1, total: 0.1, currency: "USD" }
    }]);
  });

  it("should get document cost estimation", async () => {
    const stream = getStream();
    const result = await embed.getDocumentCostEstimation(stream, "txt");
    expect(result).toEqual({ token: 0.1, total: 0.1, currency: "USD" });
    expect(TextExtractorMock.prototype.extractText).toHaveBeenCalledWith(stream, "txt");
  });

  it("should get text cost estimation", async () => {
    const result = await embed.getTextCostEstimation("Hello World");
    expect(result).toEqual({ token: 0.1, total: 0.1, currency: "USD" });
    expect(CostMock.prototype.getTokenCost).toHaveBeenCalledWith(3);
    expect(TokenizerMock.prototype.getDocTokens).toHaveBeenCalledWith("Hello World");
  });
});
