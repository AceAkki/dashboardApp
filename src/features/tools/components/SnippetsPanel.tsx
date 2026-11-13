import { useShallow } from "zustand/shallow";
import { Text } from "react-native";

import CtosPressable from "@/components/ctos/CtosPressable";
import EmptyState from "@/components/ctos/EmptyState";

import Panel from "@/components/ctos/Panel";
import { useToolsStore } from "../hooks/useToolsStore";
import SnippetForm from "./SnippetForm";
import {Snippet} from "./Snippet";

import globalStyles from "@/style/globalStyles";
import styles from "../toolsStyles";

export default function SnippetsPanel() {
  const { snippets, isPopupOpen, toggleIsPopupOpen } = useToolsStore(
    useShallow((s) => ({
      snippets: s.snippets,
      isPopupOpen: s.isPopupOpen,
      toggleIsPopupOpen: s.toggleIsPopupOpen,
    })),
  );

  const limitSnippets = snippets.slice(-4);

  return (
    <Panel
      title="SNIPPETS"
      right={
        <CtosPressable onPress={toggleIsPopupOpen} hitSlop={10}>
          <Text style={styles.toggle}>{isPopupOpen ? "CANCEL" : "+ NEW"}</Text>
        </CtosPressable>
      }
    >
      {limitSnippets.map((s) => (
        <Snippet sData={s} key={s.id} />
      ))}

      {snippets.length === 0 ? (
        <EmptyState text="no snippets saved" />
      ) : null}

      {isPopupOpen ? <SnippetForm /> : null}
    </Panel>
  );
}
