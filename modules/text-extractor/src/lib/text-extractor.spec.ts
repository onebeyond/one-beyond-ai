import { TextExtractor } from './text-extractor';
import { MimeType } from '@one-beyond-ai/mime-type';

const textExtractor = new TextExtractor(new MimeType());

describe('TextExtractor', () => {
  it('should extract text properly from pdf document', () => {
    const extracted = textExtractor.extractText('../test-files/test.pdf');
    expect(extracted).toBe('PDF text');
  });
});
