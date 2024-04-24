import { Document } from 'langchain/document';

export type TextChunk = {
  text: string;
  startLine: number;
  endLine: number;
  originalDocument: string;
  page: number;
};

export type TokenizerDocument = Omit<Document, "pageContent"> & { text: string };
