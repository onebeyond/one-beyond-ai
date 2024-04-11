import { PassThrough } from "stream";
import { streamToBlob, streamToBuffer, streamToUint8Array } from "./stream";
import { ReadStream } from "fs";

const getStream = (data: string) => {
  const stream = new PassThrough();
  stream.write(data);
  stream.end();
  return stream as unknown as ReadStream;
}
describe("Common Stream utils", () => {
  describe("streamToBuffer", () => {
    it("should convert a stream to buffer", async () => {
      const stream = getStream("Hello");
      const result = await streamToBuffer(stream);
      expect(result).toEqual(Buffer.from("Hello"));
    });
  });
  describe("streamToUint8Array", () => {
    it("should convert a stream to Uint8Array", async () => {
      const stream = getStream("Hello");
      const result = await streamToUint8Array(stream);
      expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
    });
  });
  describe("streamToBlob", () => {
    it("should convert a stream to Blob", async () => {
      const stream = getStream("Hello");
      const result = await streamToBlob(stream);
      expect(result).toBeInstanceOf(Blob);
    });
  });
});
