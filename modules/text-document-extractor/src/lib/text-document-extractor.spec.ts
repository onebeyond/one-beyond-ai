import { TextExtractor } from './text-document-extractor';
import { MimeType } from '@one-beyond-ai/mime-type';

const textExtractor = new TextExtractor(new MimeType());

describe('TextExtractor', () => {
  it('should extract text properly from pdf document', async () => {
    const absoultePath = require('path').resolve(__dirname, '../../test-files/test.pdf');
    const extracted = await textExtractor.extractText(absoultePath);
    expect(extracted).toBe('PDF text');
  });
  it.only('should extract text properly from docx document', async () => {
    const absoultePath = require('path').resolve(__dirname, '../../test-files/test.docx');
    const extracted = await textExtractor.extractText(absoultePath);
    expect(extracted).toBe('Docx text');
  });
});
