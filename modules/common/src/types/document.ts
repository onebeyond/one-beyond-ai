export type ExtractedPage = {
  pageNumber: number;
  text: string;
};

export type ExtractedDocument = {
  pages: ExtractedPage[];
};
