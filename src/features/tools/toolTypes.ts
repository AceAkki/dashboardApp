export type StandupField = "yesterday" | "today" | "blocked";

export interface snippetType {
  id: string;
  title: string;
  code: string;
  /** up to MAX_TAGS short lowercase tags (no #). Older saved snippets had a single `tag`; see upgradeSnippet. */
  tags?: string[];
}

export type appsType =  {
   id: string,
    name: string,
    scheme: string | null,
    androidPackage: string | null,
    fallbackUrl: string | null,
    platforms: string[],
    verified: boolean,
}

export type checkedApps = appsType & {
  installed: boolean;
}

export interface ToolsState {
  standup: Record<StandupField, string>;
  setStandup: (field: StandupField, value: string) => void;
  appendToday: (line: string) => void;

  snippets: snippetType[];
  addSnippet: (title: string, code: string, tags?: string[]) => void;
  updateSnippet: (id: string, title: string, code: string, tags?: string[]) => void;
  deleteSnippet: (id: string) => void;
  snippetID: string | null;
  setSnippetID: (id: string|null) => void;
  isPopupOpen: boolean;
  toggleIsPopupOpen: () => void;

  apps: checkedApps[] | null;
  setApps:({appsArr}:{appsArr:checkedApps[]}) => void;
}