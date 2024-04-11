import { PDFExtractor } from "./pdf-extractor";
import { DocxExtractor } from "./docx-extractor";
import { ExtractedDocument, FileType } from "@one-beyond-ai/common";
import { ReadStream } from "fs";
import { TextFileExtractor } from "./text-file-extractor";

export class TextExtractor {
  public async extractText(stream: ReadStream, fileType: FileType): Promise<ExtractedDocument> {
    switch (fileType) {
      case "pdf":
        return new PDFExtractor().extractText(stream);
      case "docx":
        return new DocxExtractor().extractText(stream);
      case "txt":
        return new TextFileExtractor().extractText(stream);
      default:
        throw new Error("Unsupported file type");
    }
  }
}
