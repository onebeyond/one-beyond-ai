import * as path from 'path';
import { createReadStream } from 'fs';
import { TextExtractor } from './text-document-extractor';
import { buffer } from 'node:stream/consumers';
import { Readable } from 'stream';

const textExtractor = new TextExtractor();

describe('TextDocumentExtractor', () => {
  it('should extract text properly from pdf document', async () => {
    const readStream = createReadStream(path.join(__dirname, '../../test-files/test.pdf'));
    const bufferFromStream = await buffer(readStream);
    const readable = Readable.from(bufferFromStream);
    const extracted = await textExtractor.extractText(readable, 'pdf');
    const {
      pages,
    } = extracted;
    const [firstPage, secondPage] = pages;
    expect(firstPage.text.slice(0, 67)).toBe('ASPIRIN\n®\n Pa ge 1   of 48 \nPRODUCT MONOGRAPH \nASPIRIN\n®\n Regular S');
    expect(pages.length).toBe(48);
    expect(firstPage.pageNumber).toBe(1);
    expect(secondPage.pageNumber).toBe(2);
  }, 10000);
  it('should extract text properly from docx document', async () => {
    const readStream = createReadStream(path.join(__dirname, '../../test-files/test.docx'));
    const bufferFromStream = await buffer(readStream);
    const readable = Readable.from(bufferFromStream);
    const extracted = await textExtractor.extractText(readable, 'docx');
    const {
      pages,
    } = extracted;
    const firstPage = pages[0];
    expect(firstPage.text.slice(0, 67)).toBe('ASPIRIN® Page 1 of 48\n\nPRODUCT MONOGRAPH\n\nASPIRIN® Regular Strength');
    expect(pages.length).toBe(1);
    expect(firstPage.pageNumber).toBe(1);
  }, 10000);
  it('should extract text properly from text document', async () => {
    const readStream = createReadStream(path.join(__dirname, '../../test-files/test.txt'));
    const bufferFromStream = await buffer(readStream);
    const readable = Readable.from(bufferFromStream);
    const extracted = await textExtractor.extractText(readable, 'txt');
    const {
      pages,
    } = extracted;
    const firstPage = pages[0];
    expect(firstPage.text.slice(0, 65)).toBe('PRODUCT MONOGRAPH\nASPIRIN ® Regular Strength\nacetylsalicylic acid');
    expect(pages.length).toBe(1);
    expect(firstPage.pageNumber).toBe(1);
  }, 10000);
});
