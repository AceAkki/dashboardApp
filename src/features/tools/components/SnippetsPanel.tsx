import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { Pressable, Text } from "react-native";

import Panel from "@/components/ctos/Panel";
import { useToolsStore } from "../useToolsStore";
import SnippetForm from "./SnippetForm";
import Snippet from "./Snippet";

import globalStyles from "@/style/globalStyles";
import styles from "../toolsStyles";

export default function SnippetsPanel() {
  const { snippets, isPopupOpen } = useToolsStore(
    useShallow((s) => ({
      snippets: s.snippets,
      isPopupOpen: s.isPopupOpen,
    })),
  );

  const limitSnippets = snippets.slice(-4);

  return (
    <Panel
      title="SNIPPETS"
      right={
        <Pressable onPress={() => setAdding((a) => !a)} hitSlop={10}>
          <Text style={styles.toggle}>{adding ? "CANCEL" : "+ NEW"}</Text>
        </Pressable>
      }
    >
      {limitSnippets.map((s) => (
        <Snippet sData={s} />
      ))}

      {snippets.length === 0 && !isPopupOpen ? (
        <Text style={globalStyles.textMuted}>NO SNIPPETS SAVED</Text>
      ) : null}

      {isPopupOpen ? <SnippetForm setAdding={setAdding} /> : null}
    </Panel>
  );
}
