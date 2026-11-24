import { useState } from "react";
import { Text, View, ScrollView } from "react-native";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";
import EmptyState from "@/components/ctos/EmptyState";
import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import SearchField from "@/components/ctos/SearchField";
import Tag from "@/components/ctos/Tag";
import CutCornerButton from "@/components/ctos/CutCornerButton";

import { useToolsStore } from "@/features/tools/hooks/useToolsStore";
import { Snippet } from "@/features/tools/components/Snippet";
import SnippetForm from "@/features/tools/components/SnippetForm";
import { filterSnippets, tagCounts } from "@/features/tools/snippetTags";

import globalStyles from "@/style/globalStyles";
import { useShallow } from "zustand/shallow";
import { APP_TAG } from "@/global/appInfo";
import toolsStyles from "@/features/tools/toolsStyles";

export default function SnippetVault() {
  const { snippets, isPopupOpen, toggleIsPopupOpen } = useToolsStore(
    useShallow((s) => ({
      snippets: s.snippets,
      isPopupOpen: s.isPopupOpen,
      toggleIsPopupOpen: s.toggleIsPopupOpen,
    })),
  );
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const tags = tagCounts(snippets);
  // the picked tag can disappear (its last snippet was deleted or retagged): then show everything
  const tag = tags.some((t) => t.tag === picked) ? picked : null;
  // forget a picked tag that no longer exists, so it can't switch itself back on when a snippet gets it again
  if (picked && !tag) setPicked(null);
  const shown = filterSnippets(snippets, tag, query);
  const filtering = !!tag || !!query.trim();

  return (
    <CtosScreen nav>
      <View style={globalStyles.header}>
        <Text style={globalStyles.sectionLabel}>{`${APP_TAG}Vault`}</Text>

        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}> Snippet Vault</CtosText>
          <Tag label={`${String(snippets.length).padStart(2, "0")} Snips`} />
        </View>
      </View>

      <View style={toolsStyles.vaultScroll}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="search title, text or tag…"
        />
      </View>

      <View style={toolsStyles.vaultBody}>
        {tags.length > 0 ? (
          <View>
            <ChipRow layout="scroll">
              {[{ tag: null as string | null, count: snippets.length }, ...tags].map((t) => (
                <Chip
                  key={t.tag ?? "all"}
                  label={t.tag ? `#${t.tag}` : "ALL"}
                  count={t.count}
                  selected={t.tag === tag}
                  onPress={() => setPicked(t.tag)}
                />
              ))}
            </ChipRow>
          </View>
        ) : null}

        {filtering ? (
          <Text style={globalStyles.textMuted}>
            {shown.length} OF {snippets.length}
          </Text>
        ) : null}

        <Panel style={toolsStyles.vaultPanel}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 72 }}
          >
            {shown.map((s) => (
              <Snippet sData={s} key={s.id} />
            ))}
            {snippets.length === 0 ? (
              <EmptyState text="no snippets saved" />
            ) : shown.length === 0 ? (
              <EmptyState text="nothing matches" />
            ) : null}
          </ScrollView>
          {isPopupOpen ? <SnippetForm /> : null}
        </Panel>
      </View>

      <CutCornerButton
        icon="add"
        text="New snippet"
        floating
        accessibilityLabel="Add Snippet"
        onPress={() => toggleIsPopupOpen()}
      />
    </CtosScreen>
  );
}
