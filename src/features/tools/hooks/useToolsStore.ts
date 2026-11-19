import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { notesKey } from "@/global/storageKeys";
import type { ToolsState} from "../toolTypes"
import { cleanTags } from "@/global/tagRules";
import { upgradeSnippet } from "../snippetTags";
import { markEntering } from "@/global/motion";

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
        { id: "seed-1", title: "clear metro cache", code: "npx expo start -c", tags: ["expo"] },
        {
          id: "seed-2",
          title: "tidy local branches",
          code: "git branch --merged | xargs git branch -d",
          tags: ["git"],
        },
      ],
      addSnippet: (title, code, tags) => {
        const id = makeId();
        markEntering(id);
        const list = cleanTags(tags);
        set((s) => ({
          snippets: [...s.snippets, list.length ? { id, title, code, tags: list } : { id, title, code }],
        }));
      },
      updateSnippet: (id, title, code, tags) =>
        set((s) => ({
          snippets: s.snippets.map((x) => {
            if (x.id !== id) return x;
            const { tags: _old, ...rest } = x;
            const list = cleanTags(tags);
            return list.length ? { ...rest, title, code, tags: list } : { ...rest, title, code };
          }),
        })),
      deleteSnippet: (id) => set((s) => ({ snippets: s.snippets.filter((x) => x.id !== id) })),
      snippetID: null,
      setSnippetID: (id) => set({ snippetID: id }),
      isPopupOpen: false,
      toggleIsPopupOpen: () =>
        set((state) => ({
          isPopupOpen: !state.isPopupOpen,
        })),
      apps:null,
      setApps:(({appsArr}) => set({apps:appsArr}))
    }),
    {
      name: notesKey,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ standup, snippets }) => ({ standup, snippets }),
      // version 1: a snippet's single `tag` became a list `tags`
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as { snippets?: unknown };
        if (version < 1 && Array.isArray(state?.snippets)) {
          state.snippets = state.snippets.map((s) => upgradeSnippet(s as never));
        }
        return state as never;
      },
    },
  ),
);
