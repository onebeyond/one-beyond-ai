import { TextExtractor } from './text-document-extractor';
import { MimeType } from '@one-beyond-ai/mime-type';

const textExtractor = new TextExtractor(new MimeType());

describe('TextExtractor', () => {
  it('should extract text properly from pdf document', async () => {
    const absoultePath = require('path').resolve(__dirname, '../../test-files/test.pdf');
    const extracted = await textExtractor.extractText(absoultePath);
    const {
      pages,
    } = extracted;
    const [firstPage, secondPage] = pages;
    expect(firstPage.text.slice(0, 67)).toBe('ASPIRIN\n®\n Pa ge 1   of 48 \nPRODUCT MONOGRAPH \nASPIRIN\n®\n Regular S');
    expect(pages.length).toBe(48);
    expect(firstPage.pageNumber).toBe(1);
    expect(secondPage.pageNumber).toBe(2);
  });
  it('should extract text properly from docx document', async () => {
    const absoultePath = require('path').resolve(__dirname, '../../test-files/test.docx');
    const extracted = await textExtractor.extractText(absoultePath);
    const {
      pages,
    } = extracted;
    const firstPage = pages[0];
    expect(firstPage.text.slice(0, 67)).toBe('ASPIRIN® Page 1 of 48\n\nPRODUCT MONOGRAPH\n\nASPIRIN® Regular Strength');
    expect(pages.length).toBe(1);
    expect(firstPage.pageNumber).toBe(1);
  });
});
