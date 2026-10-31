import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { Pressable, Text, TextInput, View } from "react-native";

import { writeClipboardText } from "@/global/globalFunctions";
import { useToolsStore } from "../useToolsStore";

import styles from "../toolsStyles";

const Snippet = ({ sData }) => {
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
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
  };

  return (
    <View key={sData.id} style={styles.snippet}>
      <View style={styles.snippetHead}>
        <Text style={styles.snippetTitle}># {sData.title}</Text>
        <View style={styles.snippetActions}>
          <Pressable
            onPress={() => {
              setSnippetID(sData.id);
              toggleIsPopupOpen();
            }}
            hitSlop={8}
          >
            <Text style={styles.snippetAct}>
              {snippetID === sData.id ? "Editing" : "Edit"}
            </Text>
          </Pressable>
          <Pressable onPress={() => copy(sData.id, sData.code)} hitSlop={8}>
            <Text style={styles.snippetAct}>
              {copied === sData.id ? "COPIED" : "COPY"}
            </Text>
          </Pressable>
          <Pressable onPress={() => deleteSnippet(sData.id)} hitSlop={8}>
            <Text style={styles.snippetDel}>DEL</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.snippetCode} selectable>
        {sData.code}
      </Text>
    </View>
  );
};

export default Snippet;
