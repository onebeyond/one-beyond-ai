import { ReadStream } from "fs";
import { Readable } from "stream";
import { buffer } from 'node:stream/consumers';

export const streamToUint8Array = async (stream: ReadStream): Promise<Uint8Array> => {
  const bufferFromStream = await buffer(stream);
  return Uint8Array.from(bufferFromStream);
}

export const streamToBlob = async (stream: ReadStream): Promise<Blob> => {
  const bufferFromStream = await buffer(stream);
  return new Blob([bufferFromStream]);
}

export const readableToBlob = async (readable: Readable): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const chunks: Array<any> = [];
    readable.on("data", (chunk: any) => chunks.push(chunk));
    readable.on("end", () => resolve(new Blob(chunks)));
    readable.on("error", reject);
  });
}
