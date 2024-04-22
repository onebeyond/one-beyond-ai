import { FileTypes, TokenizerModel, FileType, TokenizerModels, OldTokenizerModel, OldTokenizerModels } from "..";

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

export function assertIsModelSupported (model: unknown): asserts model is TokenizerModel {
  if (!TokenizerModels.includes(model as TokenizerModel)) {
    throw new Error(`Unsupported model: ${model}`);
  }
}

export function assertIsModelTiktokenSupported (model: unknown): asserts model is OldTokenizerModel {
  if (!OldTokenizerModels.includes(model as OldTokenizerModel)) {
    throw new Error(`Unsupported old tokenizer model: ${model}`);
  }
}
