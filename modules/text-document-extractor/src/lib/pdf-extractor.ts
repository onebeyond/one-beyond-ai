import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { ExtractedDocument } from "@one-beyond-ai/common";
import { Document } from "langchain/document";

export class PDFExtractor {
  constructor() {}
  public async loadFile(filePath: string): Promise<Document[]> {
    const pdfLoader = new PDFLoader(filePath);
    return await pdfLoader.load();
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
