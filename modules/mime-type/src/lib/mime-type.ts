import { getMIMEType } from "node-mime-types";

export class MimeType {
  constructor() {}
  public getFileMIMEType(filePath: string): string {
    return getMIMEType(filePath);
  }
}
