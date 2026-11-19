import { useShallow } from "zustand/shallow";
import { Text, View } from "react-native";

import Reveal from "@/components/ctos/Reveal";
import { leaveThen } from "@/global/motion";
import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import CopyButton from "@/components/ctos/CopyButton";
import TextAction from "@/components/ctos/TextAction";
import { feedback } from "@/hooks/useFeedback";

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
    <Reveal id={sData.id}>
    <View style={styles.snippet}>
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
              leaveThen(sData.id, () => deleteSnippet(sData.id), "delete");
              feedback.warn("SNIPPET DELETED");
            }}
          />
        </View>
      </View>
      {sData.tags?.length ? (
        <ChipRow>
          {sData.tags.map((t) => (
            <Chip key={t} label={`#${t}`} size="sm" />
          ))}
        </ChipRow>
      ) : null}
      <Text style={styles.snippetCode} selectable>
        {sData.code}
      </Text>
    </View>
    </Reveal>
  );
};


