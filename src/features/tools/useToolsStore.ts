import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { notesKey } from "@/global/storageKeys";

export type StandupField = "yesterday" | "today" | "blocked";

export interface Snippet {
  id: string;
  title: string;
  code: string;
}

export interface ToolsState {
  standup: Record<StandupField, string>;
  setStandup: (field: StandupField, value: string) => void;
  appendToday: (line: string) => void;

  snippets: Snippet[];
  addSnippet: (title: string, code: string) => void;
  deleteSnippet: (id: string) => void;
  snippetID: string | null;
  setSnippetID: (id: string) => void;
  isPopupOpen: boolean;
  toggleIsPopupOpen: () => void;
}

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useToolsStore = create<ToolsState>()(
  persist(
    (set) => ({
      standup: { yesterday: "", today: "", blocked: "" },
      setStandup: (field, value) =>
        set((s) => ({ standup: { ...s.standup, [field]: value } })),
      appendToday: (line) =>
        set((s) => ({
          standup: {
            ...s.standup,
            today: s.standup.today ? `${s.standup.today}\n${line}` : line,
          },
        })),
      snippets: [
        { id: "seed-1", title: "clear metro cache", code: "npx expo start -c" },
        {
          id: "seed-2",
          title: "tidy local branches",
          code: "git branch --merged | xargs git branch -d",
        },
      ],
      addSnippet: (title, code) =>
        set((s) => ({
          snippets: [...s.snippets, { id: makeId(), title, code }],
        })),
      deleteSnippet: (id) =>
        set((s) => ({ snippets: s.snippets.filter((x) => x.id !== id) })),
      snippetID: null,
      setSnippetID: (id) => set({ snippetID: id }),
      isPopupOpen: false,
      toggleIsPopupOpen: () =>
        set((state) => ({
          isPopupOpen: !state.isPopupOpen,
        })),
    }),
    {
      name: notesKey,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ standup, snippets }) => ({ standup, snippets }),
    },
  ),
);
