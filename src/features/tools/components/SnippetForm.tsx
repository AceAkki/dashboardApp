import { useState } from "react";
import { useIsFocused } from "expo-router";
import { useShallow } from "zustand/shallow";

import Button from "@/components/ctos/Button";
import ButtonRow from "@/components/ctos/ButtonRow";
import Field from "@/components/ctos/Field";
import Sheet from "@/components/ctos/Sheet";
import TagEditor, { useTagField } from "@/components/ctos/TagEditor";
import { feedback } from "@/hooks/useFeedback";

import { useToolsStore } from "../hooks/useToolsStore";
import { tagCounts } from "../snippetTags";

const SnippetForm = () => {
  const { snippets, addSnippet, updateSnippet, snippetID, setSnippetID, toggleIsPopupOpen } =
    useToolsStore(
      useShallow((s) => ({
        snippets: s.snippets,
        addSnippet: s.addSnippet,
        updateSnippet: s.updateSnippet,
        snippetID: s.snippetID,
        setSnippetID: s.setSnippetID,
        toggleIsPopupOpen: s.toggleIsPopupOpen,
      })),
    );

  const selectedSnippet = snippetID ? snippets.find((s) => s.id === snippetID) : null;

  const [title, setTitle] = useState(selectedSnippet?.title ?? "");
  const [code, setCode] = useState(selectedSnippet?.code ?? "");
  const tagField = useTagField(selectedSnippet?.tags ?? []);
  const known = tagCounts(snippets).map((t) => t.tag);

  const [tried, setTried] = useState(false);

  // The nav bar pushes screens, so the dashboard and the Snippets page can both be mounted.
  // They share one open/closed flag: only the screen in front may show the sheet.
  const focused = useIsFocused();

  // so the next "+ NEW" is a new snippet, not an edit of this one
  const close = () => {
    setSnippetID(null);
    // only if it is still open: closing twice must not open it again
    if (useToolsStore.getState().isPopupOpen) toggleIsPopupOpen();
  };

  const save = () => {
    if (!title.trim() || !code.trim()) {
      setTried(true);
      feedback.error("TITLE AND TEXT NEEDED");
      return;
    }
    if (selectedSnippet) {
      updateSnippet(selectedSnippet.id, title.trim(), code.trim(), tagField.final);
    } else {
      addSnippet(title.trim(), code.trim(), tagField.final);
    }
    feedback.success(selectedSnippet ? "SNIPPET UPDATED" : "SNIPPET SAVED");
    close();
  };

  if (!focused) return null;

  return (
    <Sheet onClose={close} title={`${selectedSnippet ? "EDIT" : "NEW"} SNIPPET`}>
      <Field
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="title"
        error={tried && !title.trim() ? "TITLE NEEDED" : undefined}
      />
      <Field
        label="Text"
        value={code}
        onChangeText={setCode}
        placeholder="command, code or note"
        autoCapitalize="none"
        autoCorrect={false}
        multiline
        error={tried && !code.trim() ? "TEXT NEEDED" : undefined}
      />
      <TagEditor field={tagField} known={known} />
      <ButtonRow>
        <Button label="Cancel" variant="secondary" onPress={close} style={{ flex: 1 }} />
        <Button label="Save" haptic="none" onPress={save} style={{ flex: 1 }} />
      </ButtonRow>
    </Sheet>
  );
};

export default SnippetForm;
