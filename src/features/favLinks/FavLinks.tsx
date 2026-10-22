import { useEffect, useState } from "react";
import { Keyboard, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SearchLink from "./components/SearchLink";
import SearchEngines from "./components/SearchEngines";
import QuickLinks from "./components/QuickLinks";
import { favLinks } from "./favLinksData";
import { buildSearchUrl, openLink } from "./utils/openLink";
import type { SearchState } from "./favLinkTypes";
import favLinksStyles from "./favLinksStyles";

const ENGINE_KEY = "favlinks-engine";
const DEFAULT_ENGINE = favLinks.SearchLinks[0].name;

const FavLinks = () => {
  const [search, setSearch] = useState<SearchState>({
    engine: DEFAULT_ENGINE,
    query: "",
  });

  // remember the last engine used
  useEffect(() => {
    AsyncStorage.getItem(ENGINE_KEY)
      .then((saved) => {
        if (saved && favLinks.SearchLinks.some((l) => l.name === saved)) {
          setSearch((prev) => ({ ...prev, engine: saved }));
        }
      })
      .catch(() => {});
  }, []);

  const selectEngine = (engine: string) => {
    setSearch((prev) => ({ ...prev, engine }));
    AsyncStorage.setItem(ENGINE_KEY, engine).catch(() => {});
  };

  const runSearch = async () => {
    const engine = favLinks.SearchLinks.find((l) => l.name === search.engine);
    if (!engine || search.query.trim() === "") return;

    Keyboard.dismiss();
    const opened = await openLink(buildSearchUrl(engine.searchURL, search.query), engine.name);
    if (opened) setSearch((prev) => ({ ...prev, query: "" }));
  };

  return (
    <View style={favLinksStyles.favLinks}>
      <View>
        <Text style={favLinksStyles.sectionLabel}>Search</Text>
        <SearchLink
          search={search}
          setSearch={setSearch}
          onSubmit={runSearch}
          engineName={search.engine}
        />
      </View>

      <View>
        <Text style={favLinksStyles.sectionLabel}>Search engine</Text>
        <SearchEngines selected={search.engine} onSelect={selectEngine} />
      </View>

      <View>
        <Text style={favLinksStyles.sectionLabel}>Quick links</Text>
        <QuickLinks />
      </View>
    </View>
  );
};

export default FavLinks;
