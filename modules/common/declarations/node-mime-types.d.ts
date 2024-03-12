declare module "node-mime-types" {
    export const getExtension: (mimeType: string) => string;
    export const getMIMEType: (extension: string) => string;
  }