import { MimeType } from './mime-type';

const mimeType = new MimeType();

describe('MimeType', () => {
  it('should work valid file path', () => {
    expect(mimeType.getFileMIMEType('../test-files/test.pdf')).toBe('application/pdf');
    expect(mimeType.getFileMIMEType('../test-files/test.pages')).toBe('application/x-iwork-pages-sffpages');
    expect(mimeType.getFileMIMEType('../test-files/test.docx')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  });
});
