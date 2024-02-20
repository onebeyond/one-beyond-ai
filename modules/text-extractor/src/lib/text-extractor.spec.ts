import {TextExtractor} from './text-extractor';

const textExtractor = new TextExtractor();

describe('textExtractor', () => {
  it('should work', () => {
    expect(textExtractor.forTest()).toEqual('text-extractor');
  });
});
