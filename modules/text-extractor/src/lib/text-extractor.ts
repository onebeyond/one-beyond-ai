import { MimeType } from "@one-beyond-ai/mime-type";

export class TextExtractor {
  constructor(private mimeType: MimeType) {}
  public extractText(filePath: string): string {
    const mimeType = this.mimeType.getFileMIMEType(filePath);
    if (mimeType === "application/pdf") {
      return "PDF text";
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
