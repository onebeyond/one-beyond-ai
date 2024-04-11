export const FileTypes = ["pdf", "docx", "text"] as const;
export type FileType = typeof FileTypes[number];
