import { useShallow } from "zustand/shallow";

import TextAction from "@/components/ctos/TextAction";
import EmptyState from "@/components/ctos/EmptyState";

import Panel from "@/components/ctos/Panel";
import { useToolsStore } from "../hooks/useToolsStore";
import SnippetForm from "./SnippetForm";
import {Snippet} from "./Snippet";


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
        <TextAction label={isPopupOpen ? "CANCEL" : "+ NEW"} onPress={toggleIsPopupOpen} />
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
