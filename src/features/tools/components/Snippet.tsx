import { useShallow } from "zustand/shallow";
import { Text, View } from "react-native";

import CopyButton from "@/components/ctos/CopyButton";
import TextAction from "@/components/ctos/TextAction";
import { feedback } from "@/global/useFeedback";

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
  return (
    <View key={sData.id} style={styles.snippet}>
      <View style={styles.snippetHead}>
        <Text style={styles.snippetTitle}># {sData.title}</Text>
        <View style={styles.snippetActions}>
          <TextAction
            label={snippetID === sData.id ? "Editing" : "Edit"}
            onPress={() => {
              setSnippetID(sData.id);
              // open it, never toggle it shut
              if (!useToolsStore.getState().isPopupOpen) toggleIsPopupOpen();
            }}
          />
          <CopyButton text={sData.code} />
          <TextAction
            label="DEL"
            tone="danger"
            haptic="none"
            onPress={() => {
              deleteSnippet(sData.id);
              feedback.warn("SNIPPET DELETED");
            }}
          />
        </View>
      </View>
      {sData.tag ? <Text style={styles.snippetTag}>#{sData.tag}</Text> : null}
      <Text style={styles.snippetCode} selectable>
        {sData.code}
      </Text>
    </View>
  );
};


