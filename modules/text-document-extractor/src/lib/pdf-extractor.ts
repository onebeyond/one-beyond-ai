import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { ExtractedDocument, streamToBlob } from "@one-beyond-ai/common";
import { Document } from "langchain/document";
import { ReadStream } from "fs";

export class PDFExtractor {
  public async loadFile(stream: ReadStream): Promise<Document[]> {
    const file = await streamToBlob(stream);
    const pdfLoader = new PDFLoader(file);
    return await pdfLoader.load();
  }
  public async extractText(stream: ReadStream): Promise<ExtractedDocument> {
    const rawDocument = await this.loadFile(stream);
    return {
      pages: rawDocument.map((page, index) => ({
        text: page.pageContent,
        pageNumber: index + 1,
      })),
    };
  }
}
