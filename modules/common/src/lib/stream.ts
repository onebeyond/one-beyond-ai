import { ReadStream } from "fs";

export const streamToUint8Array = async (stream: ReadStream): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const chunks: Array<any> = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("end", () => resolve(Uint8Array.from(Buffer.concat(chunks))));
    stream.on("error", reject);
  });
}
