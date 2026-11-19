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
import styles from "@/features/tools/toolsStyles";
import { useShallow } from "zustand/shallow";
import { APP_TAG } from "@/global/appInfo";

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

      <View style={styles.vaultScroll}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="search title, text or tag…"
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.vaultScroll, styles.scene]}
        keyboardShouldPersistTaps="handled"
      >
        {tags.length > 0 ? (
          <ChipRow>
            {[
              { tag: null as string | null, count: snippets.length },
              ...tags,
            ].map((t) => (
              <Chip
                key={t.tag ?? "all"}
                label={t.tag ? `#${t.tag}` : "ALL"}
                count={t.count}
                selected={t.tag === tag}
                onPress={() => setPicked(t.tag)}
              />
            ))}
          </ChipRow>
        ) : null}

        {filtering ? (
          <Text style={globalStyles.textMuted}>
            {shown.length} OF {snippets.length}
          </Text>
        ) : null}

        <Panel style={styles.scene}>
          {shown.map((s) => (
            <Snippet sData={s} key={s.id} />
          ))}
          {snippets.length === 0 ? (
            <EmptyState text="no snippets saved" />
          ) : shown.length === 0 ? (
            <EmptyState text="nothing matches" />
          ) : null}
          {isPopupOpen ? <SnippetForm /> : null}
        </Panel>
      </ScrollView>

      <CutCornerButton
        icon="add"
        text="Add"
        size={50}
        floating
        accessibilityLabel="Add Snippet"
        onPress={() => toggleIsPopupOpen()}
      />
    </CtosScreen>
  );
}
