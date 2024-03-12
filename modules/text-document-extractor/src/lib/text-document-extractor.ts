import { MimeType } from "@one-beyond-ai/mime-type";
import { PDFExtractor } from "./pdf-extractor";

export class TextExtractor {
  constructor(private mimeType: MimeType) {}
  public async extractText(filePath: string): Promise<string> {
    const mimeType = this.mimeType.getFileMIMEType(filePath);
    if (mimeType === "application/pdf") {
      const extracted = await new PDFExtractor().extractText(filePath) as any;
      return extracted;
    }
    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return "DOCX text";
    }
    if (mimeType === "application/x-iwork-pages-sffpages") {
      return "PAGES text";
    }
    return "";
  }
}
