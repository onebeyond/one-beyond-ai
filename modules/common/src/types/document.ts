export type ExtractedPage = {
  pageNumber?: number;
  text: string;
};

export type ExtractedPageWithReference = {
  originalDocument: string;
} & ExtractedPage;

export type ExtractedDocument = {
  pages: ExtractedPage[];
};

export type ExtractedDocumentWithReference = {
  pages: ExtractedPageWithReference[];
};
