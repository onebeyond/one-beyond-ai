import { MimeType } from "@one-beyond-ai/mime-type";
import { PDFExtractor } from "./pdf-extractor";
import { DocxExtractor } from "./docx-extractor";

export class TextExtractor {
  constructor(private mimeType: MimeType) {}
  public async extractText(filePath: string): Promise<string> {
    const mimeType = this.mimeType.getFileMIMEType(filePath);
    if (mimeType === "application/pdf") {
      const extracted = await new PDFExtractor().extractText(filePath) as any;
      return extracted;
    }
    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const extracted = await new DocxExtractor().extractText(filePath) as any;
      return extracted;
    }
    if (mimeType === "application/x-iwork-pages-sffpages") {
      return "PAGES text";
    }
    return "";
  }
}
