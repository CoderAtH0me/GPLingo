import { useDevAccessStore } from "../store/devAccess";
import { ChatGPTApi } from "./openai";

export const ROLES = ["sustem", "user", "assistant"] as const;
export type MessageRole = (typeof ROLES)[number];

export const Models = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-4",
  "whisper-1",
  "text-embedding-ada-002",
] as const;
export type AiModels = (typeof Models)[number];

export interface RequestMessage {
  role: MessageRole;
  content: string;
}

export interface ChatConfig {
  model: AiModels;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface ChatOptions {
  config: ChatConfig;
  messages: RequestMessage[];

  onUpdate?: (message: string, chunk: string) => void;
  onFinish: (message: string) => void;
  onController?: (controller: AbortController) => void;
  onError?: (err: Error) => void;
}

export abstract class ChatApi {
  abstract chat(options: ChatOptions): Promise<void>;
}

export class ClientApi {
  public chatApi: ChatApi;

  constructor() {
    this.chatApi = new ChatGPTApi();
  }

  config() {}

  prompts() {}

  masks() {}
}

export const api = new ClientApi();

export function getHeaders(contentType: string | null = null) {
  const devAccessStore = useDevAccessStore();

  let headers: Record<string, string> = {
    "Content-Type": contentType ?? "application/json",
    "x-request-with": "XMLHttpRequest",
  };

  const makeBearer = (token: string) => `Bearer ${token.trim()}`;
  const validString = (x: string) => x && x.length > 0;

  if (validString(devAccessStore.token)) {
    headers["Authorization"] = makeBearer(devAccessStore.token);
  }

  return headers;
}
