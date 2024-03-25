import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { ExtractedDocument } from "@one-beyond-ai/common";

export class DocxExtractor {
  constructor() {}
  public async extractText(filePath: string): Promise<ExtractedDocument> {
    const docxLoader = new DocxLoader(filePath);
    const rawDocument = await docxLoader.load();
    return "Docx text" as any;
  }
}
