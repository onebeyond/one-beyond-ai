import { TextLoader } from "langchain/document_loaders/fs/text";
import { ExtractedDocument } from "@one-beyond-ai/common";
import { Document } from "langchain/document";

export class TextFileExtractor {
  constructor() {}
  public async loadFile(filePath: string): Promise<Document[]> {
    const textLoader = new TextLoader(filePath);
    return await textLoader.load();
  }
  public async extractText(filePath: string): Promise<ExtractedDocument> {
    const rawDocument = await this.loadFile(filePath);
    const document: ExtractedDocument = {
      pages: rawDocument.map((page, index) => ({
        text: page.pageContent,
        pageNumber: index + 1,
      })),
    };
    return document;
  }
}
