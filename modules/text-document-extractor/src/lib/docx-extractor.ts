import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { ExtractedDocument } from "@one-beyond-ai/common";
import { Document } from "langchain/document";

export class DocxExtractor {
  constructor() {}
  public async loadFile(filePath: string): Promise<Document[]> {
    const docxLoader = new DocxLoader(filePath);
    return await docxLoader.load();
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
