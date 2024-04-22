import { TextLoader } from "langchain/document_loaders/fs/text";
import { ExtractedDocument, ExtractedDocumentWithReference, readableToBlob } from "@one-beyond-ai/common";
import { Document } from "langchain/document";
import { Readable } from "stream";

export class TextFileExtractor {
  public async loadFile(readable: Readable): Promise<Document[]> {
    const file = await readableToBlob(readable);
    const pdfLoader = new TextLoader(file);
    return await pdfLoader.load();
  }
  public async extractText(readable: Readable, originalDocument?: string): Promise<ExtractedDocument | ExtractedDocumentWithReference> {
    const rawDocument = await this.loadFile(readable);
    return {
      pages: rawDocument.map((page, index) => ({
        text: page.pageContent,
        pageNumber: index + 1,
        originalDocument,
      })),
    };
  }
}
