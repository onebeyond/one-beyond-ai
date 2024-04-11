export const FileTypes = ["pdf", "docx", "txt"] as const;
export type FileType = typeof FileTypes[number];
