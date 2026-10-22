export type FavLink = {
  name: string;
  favicon: string;
  searchURL: string;
};

export type FavLinkGroups = {
  SearchLinks: FavLink[];
  StaticLinks: FavLink[];
};

// selected engine (by name) + what the user typed
export type SearchState = {
  engine: string;
  query: string;
};

export type SearchLinkProps = {
  search: SearchState;
  setSearch: React.Dispatch<React.SetStateAction<SearchState>>;
  onSubmit: () => void;
};

export type SearchEnginesProps = {
  selected: string;
  onSelect: (name: string) => void;
};
