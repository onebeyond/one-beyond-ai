import { FileTypes } from "..";
import { FileType } from "..";

export const assertIsFileTypeSupported = (fileType: string): asserts fileType is FileType => {
  if (!FileTypes.includes(fileType as FileType)) {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}