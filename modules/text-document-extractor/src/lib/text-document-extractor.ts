import { PDFExtractor } from "./pdf-extractor";
import { DocxExtractor } from "./docx-extractor";
import { ExtractedDocument, ExtractedDocumentWithReference, FileType } from "@one-beyond-ai/common";
import { TextFileExtractor } from "./text-file-extractor";
import { Readable } from "stream";

export class TextExtractor {
  public async extractText(readable: Readable, fileType: FileType, originalDocument?: string): Promise<ExtractedDocument | ExtractedDocumentWithReference> {
    switch (fileType) {
      case "pdf":
        return new PDFExtractor().extractText(readable, originalDocument);
      case "docx":
        return new DocxExtractor().extractText(readable, originalDocument);
      case "txt":
        return new TextFileExtractor().extractText(readable, originalDocument);
      default:
        throw new Error("Unsupported file type");
    }
  }
}
