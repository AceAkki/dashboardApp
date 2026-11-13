import { useState } from "react";
import { Text, View, ScrollView } from "react-native";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";
import CtosPressable from "@/components/ctos/CtosPressable";
import EmptyState from "@/components/ctos/EmptyState";
import FocusInput from "@/components/ctos/FocusInput";
import { Colors } from "@/constants/Colors";

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
  const shown = filterSnippets(snippets, tag, query);
  const filtering = !!tag || !!query.trim();

  return (
    <CtosScreen nav>
      <View style={globalStyles.header}>
        <Text style={globalStyles.sectionLabel}>{`${APP_TAG}Vault`}</Text>

        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}> Snippet Vault</CtosText>
          <CtosPressable onPress={toggleIsPopupOpen} hitSlop={10}>
            <Text style={styles.toggle}>
              {isPopupOpen ? "CANCEL" : "+ NEW"}
            </Text>
          </CtosPressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.vaultScroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.search}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>/</Text>
          <FocusInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="search title, text or tag…"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search snippets"
          />
          {query ? (
            <Text
              style={{ color: Colors.primary, fontSize: 11, letterSpacing: 1 }}
              onPress={() => setQuery("")}
              suppressHighlighting
            >
              CLEAR
            </Text>
          ) : null}
        </View>

        {tags.length > 0 ? (
          <View style={styles.tagChips}>
            {[{ tag: null as string | null, count: snippets.length }, ...tags].map(
              (t) => {
                const active = t.tag === tag;
                return (
                  <CtosPressable
                    haptic="select"
                    key={t.tag ?? "all"}
                    style={[globalStyles.chip, active && globalStyles.chipActive]}
                    onPress={() => setPicked(t.tag)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text
                      style={[
                        globalStyles.textSmall,
                        active && { color: Colors.primary },
                      ]}
                    >
                      {t.tag ? `#${t.tag}` : "ALL"} {t.count}
                    </Text>
                  </CtosPressable>
                );
              },
            )}
          </View>
        ) : null}

        {filtering ? (
          <Text style={globalStyles.textMuted}>
            {shown.length} OF {snippets.length}
          </Text>
        ) : null}

        <Panel>
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
    </CtosScreen>
  );
}
