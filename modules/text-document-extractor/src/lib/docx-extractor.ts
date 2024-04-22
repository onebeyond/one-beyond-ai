import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { ExtractedDocument, ExtractedDocumentWithReference, readableToBlob } from "@one-beyond-ai/common";
import { Document } from "langchain/document";
import { Readable } from "stream";

export class DocxExtractor {
  public async loadFile(readable: Readable): Promise<Document[]> {
    const file = await readableToBlob(readable);
    const docxLoader = new DocxLoader(file);
    return await docxLoader.load();
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
