import { PassThrough } from "stream";
import { streamToBlob, streamToBuffer, streamToUint8Array } from "./stream";

describe("Common Stream utils", () => {
  describe("streamToBuffer", () => {
    it("should convert a stream to buffer", async () => {
      const stream = new PassThrough();
      stream.write("Hello");
      stream.end();
      const result = await streamToBuffer(stream as any);
      expect(result).toEqual(Buffer.from("Hello"));
    });
  });
  describe("streamToUint8Array", () => {
    it("should convert a stream to Uint8Array", async () => {
      const stream = new PassThrough();
      stream.write("Hello");
      stream.end();
      const result = await streamToUint8Array(stream as any);
      expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
    });
  });
  describe("streamToBlob", () => {
    it("should convert a stream to Blob", async () => {
      const stream = new PassThrough();
      stream.write("Hello");
      stream.end();
      const result = await streamToBlob(stream as any);
      expect(result).toBeInstanceOf(Blob);
    });
  });
});
