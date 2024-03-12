import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { ExtractedDocument } from "@one-beyond-ai/common";

export class PDFExtractor {
  constructor() {}
  public async extractText(filePath: string): Promise<ExtractedDocument> {
    const pdfLoader = new PDFLoader(filePath);
    const rawDocument = await pdfLoader.load();
    console.log(JSON.stringify(rawDocument, null, 2));
    return "PDF text" as any;
  }
}
