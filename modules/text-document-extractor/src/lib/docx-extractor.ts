import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { ExtractedDocument, streamToBlob } from "@one-beyond-ai/common";
import { Document } from "langchain/document";
import { ReadStream } from "fs";

export class DocxExtractor {
  constructor() {}
  public async loadFile(stream: ReadStream): Promise<Document[]> {
    const file = await streamToBlob(stream);
    const docxLoader = new DocxLoader(file);
    return await docxLoader.load();
  }
  public async extractText(stream: ReadStream): Promise<ExtractedDocument> {
    const rawDocument = await this.loadFile(stream);
    const document: ExtractedDocument = {
      pages: rawDocument.map((page, index) => ({
        text: page.pageContent,
        pageNumber: index + 1,
      })),
    };
    return document;
  }
}
