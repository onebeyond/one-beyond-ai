export type AudioTranscriptionOptions = {
  language?: string;
  prompt?: string;
  temperature?: number;
}

export type AudioSegment = {
  id: number;
  start: number;
  end: number;
  text: string;
  temperature: number;
  avgLogprob: number;
  compressionRatio: number;
  noSpeechProb: number;
  tokens: number[];
  seek: number;
}

export type AudioTranscriptionResultSimpleJson = {
  text: string;
}

export type AudioTranscriptionResultVerboseJson = AudioTranscriptionResultSimpleJson & {
  task: string;
  language: string;
  duration: number;
  segments: AudioSegment[];
}

export type AudioTranscriptionResultFormat = "text" | "srt" | "vtt" | "json" | "verbose_json";

export type AudioTranscriptionResult<ResponseFormat extends AudioTranscriptionResultFormat> = {
  json: AudioTranscriptionResultSimpleJson;
  verbose_json: AudioTranscriptionResultVerboseJson;
  vtt: string;
  srt: string;
  text: string;
}[ResponseFormat];

