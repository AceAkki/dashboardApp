import { useState } from "react";
import { Text, View, Pressable } from "react-native";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";

import { useToolsStore, type ToolsState } from "@/features/tools/useToolsStore";
import Snippet from "@/features/tools/components/Snippet";
import SnippetForm from "@/features/tools/components/SnippetForm";

import globalStyles from "@/style/globalStyles";
import styles from "@/features/tools/toolsStyles";
import { useShallow } from "zustand/shallow";

export default function SnippetVault() {
  const { snippets, isPopupOpen, toggleIsPopupOpen } = useToolsStore(
    useShallow((s) => ({
      snippets: s.snippets,
      isPopupOpen: s.isPopupOpen,
      toggleIsPopupOpen: s.toggleIsPopupOpen,
    })),
  );

  return (
    <CtosScreen nav>
      <View style={globalStyles.header}>
        <Text style={globalStyles.sectionLabel}>{"// Vault"}</Text>
        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}> Snippet Vault</CtosText>
          <Pressable onPress={() => toggleIsPopupOpen((a) => !a)} hitSlop={10}>
            <Text style={styles.toggle}>
              {isPopupOpen ? "CANCEL" : "+ NEW"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={globalStyles.scene}>
        <Panel style={globalStyles.containerFull}>
          {snippets.map((s) => (
            <Snippet sData={s} key={s.id} />
          ))}
          {snippets.length === 0 ? (
            <Text style={globalStyles.textMuted}>NO SNIPPETS SAVED</Text>
          ) : null}
          {isPopupOpen ? <SnippetForm /> : null}
        </Panel>
      </View>
    </CtosScreen>
  );
}
