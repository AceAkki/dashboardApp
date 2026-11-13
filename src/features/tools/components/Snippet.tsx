import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { Text, View } from "react-native";

import CtosPressable from "@/components/ctos/CtosPressable";
import { feedback } from "@/global/useFeedback";

import { writeClipboardText } from "@/global/globalFunctions";
import { useToolsStore } from "../hooks/useToolsStore";

import type { snippetType } from "../toolTypes";
import styles from "../toolsStyles";

export const Snippet = ({ sData }:{sData:snippetType}) => {
  const { deleteSnippet, snippetID, setSnippetID, toggleIsPopupOpen } =
    useToolsStore(
      useShallow((s) => ({
        deleteSnippet: s.deleteSnippet,
        snippetID: s.snippetID,
        setSnippetID: s.setSnippetID,
        toggleIsPopupOpen: s.toggleIsPopupOpen,
      })),
    );
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (id: string, snippetCode: string) => {
    await writeClipboardText(snippetCode);
    feedback.success();
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
  };

  return (
    <View key={sData.id} style={styles.snippet}>
      <View style={styles.snippetHead}>
        <Text style={styles.snippetTitle}># {sData.title}</Text>
        <View style={styles.snippetActions}>
          <CtosPressable
            onPress={() => {
              setSnippetID(sData.id);
              toggleIsPopupOpen();
            }}
            hitSlop={8}
          >
            <Text style={styles.snippetAct}>
              {snippetID === sData.id ? "Editing" : "Edit"}
            </Text>
          </CtosPressable>
          <CtosPressable haptic="none" onPress={() => copy(sData.id, sData.code)} hitSlop={8}>
            <Text style={styles.snippetAct}>
              {copied === sData.id ? "COPIED" : "COPY"}
            </Text>
          </CtosPressable>
          <CtosPressable
            haptic="none"
            onPress={() => {
              deleteSnippet(sData.id);
              feedback.warn("SNIPPET DELETED");
            }}
            hitSlop={8}
          >
            <Text style={styles.snippetDel}>DEL</Text>
          </CtosPressable>
        </View>
      </View>
      {sData.tag ? <Text style={styles.snippetTag}>#{sData.tag}</Text> : null}
      <Text style={styles.snippetCode} selectable>
        {sData.code}
      </Text>
    </View>
  );
};


