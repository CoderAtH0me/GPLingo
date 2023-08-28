import { nanoid } from "nanoid";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AiModels, RequestMessage } from "@/app/client/api";

export type ChatMessage = RequestMessage & {
  date: string;
  streaming?: boolean;
  isError?: boolean;
  id: string;
  model?: AiModels;
};

export function createMessage(override: Partial<ChatMessage>): ChatMessage {
  return {
    id: nanoid(),
    date: new Date().toLocaleString(),
    role: "user",
    content: "",
    ...override,
  };
}

export interface ChatStat {
  tokenCount: number;
  wordCount: number;
  charCount: number;
}

export interface ChatSession {
  id: string;
  topic: string;

  systemPrompt: string;
  lessonOutline: string;
  memoryPrompt: string;
  messages: ChatMessage[];


  stat: ChatStat;
  lastUpdate: number;
  lastSummarizeIndex: number;
  clearContextIndex?: number;

  
}
