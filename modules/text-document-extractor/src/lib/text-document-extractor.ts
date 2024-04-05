import { MimeType } from "@one-beyond-ai/mime-type";
import { PDFExtractor } from "./pdf-extractor";
import { DocxExtractor } from "./docx-extractor";
import { ExtractedDocument } from "@one-beyond-ai/common";

export class TextExtractor {
  constructor(private mimeType: MimeType) {}
  public async extractText(filePath: string): Promise<ExtractedDocument> {
    const mimeType = this.mimeType.getFileMIMEType(filePath);
    if (mimeType === "application/pdf") {
      const extracted = await new PDFExtractor().extractText(filePath) as any;
      return extracted;
    }
    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const extracted = await new DocxExtractor().extractText(filePath) as any;
      return extracted;
    }

    switch (mimeType) {
      case "application/pdf":
        return await new PDFExtractor().extractText(filePath) as any;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return await new DocxExtractor().extractText(filePath) as any;
      default:
        throw new Error("Unsupported file type");
    }
  }
}
