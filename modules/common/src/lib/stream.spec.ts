import { PassThrough } from "stream";
import { streamToUint8Array } from "./stream";

describe("Common Stream utils", () => {
  describe("streamToUint8Array", () => {
    it("should convert a stream to Uint8Array", async () => {
      const stream = new PassThrough();
      stream.write("Hello");
      stream.end();
      const result = await streamToUint8Array(stream as any);
      expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
    });
  });
});
