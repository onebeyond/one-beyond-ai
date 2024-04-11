import { ReadStream } from "fs";

export const streamToBuffer = async (stream: ReadStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Array<any> = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export const streamToUint8Array = async (stream: ReadStream): Promise<Uint8Array> => {
  const buffer = await streamToBuffer(stream);
  return Uint8Array.from(buffer);
}

export const streamToBlob = async (stream: ReadStream): Promise<Blob> => {
  const buffer = await streamToBuffer(stream);
  return new Blob([buffer]);
}
