import { FileTypes } from "..";
import { FileType } from "..";

export const assertIsFileTypeSupported = (fileType: string): asserts fileType is FileType => {
  if (!FileTypes.includes(fileType as FileType)) {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

export function assertEnvironmentVariable (variable: string | undefined, name: string): asserts variable is string {
  if (!variable) {
    throw new Error(`Environment variable ${name} is not set`);
  }
}