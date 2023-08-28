import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DevAccessControlStore {
  token: string;
  openaiUrl: string;

  updateToken: (_: string) => void;
  updateOpenaiUrl: (_: string) => void;
}
export const useDevAccessStore = create<DevAccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      openaiUrl: "",

      updateToken(token: string) {
        set(() => ({ token: token?.trim() }));
      },
      updateOpenaiUrl(url: string) {
        set(() => ({ openaiUrl: url?.trim() }));
      },
    }),
    {
      name: "dev-access-control",
      version: 1,
    }
  )
);
