import { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CtosText from "@/components/CtosText";
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
        <CtosText style={favLinksStyles.sectionLabel}>Search</CtosText>
        <SearchLink
          search={search}
          setSearch={setSearch}
          onSubmit={runSearch}
          engineName={search.engine}
        />
      </View>

      <View>
        <CtosText style={favLinksStyles.sectionLabel}>Search engine</CtosText>
        <SearchEngines selected={search.engine} onSelect={selectEngine} />
      </View>

      <View>
        <CtosText style={favLinksStyles.sectionLabel}>Quick links</CtosText>
        <QuickLinks />
      </View>
    </View>
  );
};

export default FavLinks;