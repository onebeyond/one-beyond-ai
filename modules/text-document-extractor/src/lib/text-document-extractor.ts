import { PDFExtractor } from "./pdf-extractor";
import { DocxExtractor } from "./docx-extractor";
import { ExtractedDocument, FileType } from "@one-beyond-ai/common";
import { TextFileExtractor } from "./text-file-extractor";
import { Readable } from "stream";

export class TextExtractor {
  public async extractText(readable: Readable, fileType: FileType): Promise<ExtractedDocument> {
    switch (fileType) {
      case "pdf":
        return new PDFExtractor().extractText(readable);
      case "docx":
        return new DocxExtractor().extractText(readable);
      case "txt":
        return new TextFileExtractor().extractText(readable);
      default:
        throw new Error("Unsupported file type");
    }
  }
}
