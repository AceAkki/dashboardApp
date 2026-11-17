import { useState } from "react";
import { useShallow } from "zustand/shallow";

import Button from "@/components/ctos/Button";
import ButtonRow from "@/components/ctos/ButtonRow";
import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import Field from "@/components/ctos/Field";
import Sheet from "@/components/ctos/Sheet";
import { feedback } from "@/global/useFeedback";

import { useToolsStore } from "../hooks/useToolsStore";
import { cleanTag, tagCounts } from "../snippetTags";

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
  const [tag, setTag] = useState(selectedSnippet?.tag ?? "");
  const known = tagCounts(snippets).slice(0, 8);
  const currentTag = cleanTag(tag);

  const [tried, setTried] = useState(false);

  // so the next "+ NEW" is a new snippet, not an edit of this one
  const close = () => {
    setSnippetID(null);
    toggleIsPopupOpen();
  };

  const save = () => {
    if (!title.trim() || !code.trim()) {
      setTried(true);
      feedback.error("TITLE AND TEXT NEEDED");
      return;
    }
    if (selectedSnippet) {
      updateSnippet(selectedSnippet.id, title.trim(), code.trim(), tag);
    } else {
      addSnippet(title.trim(), code.trim(), tag);
    }
    feedback.success(selectedSnippet ? "SNIPPET UPDATED" : "SNIPPET SAVED");
    close();
  };

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
      <Field
        label="Tag"
        value={tag}
        onChangeText={setTag}
        placeholder="git, docker, notes"
        help="OPTIONAL"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={30}
      />
      {known.length > 0 ? (
        <ChipRow>
          {known.map((t) => (
            <Chip
              key={t.tag}
              label={`#${t.tag}`}
              selected={currentTag === t.tag}
              onPress={() => setTag(currentTag === t.tag ? "" : t.tag)}
            />
          ))}
        </ChipRow>
      ) : null}
      <ButtonRow>
        <Button label="Cancel" variant="secondary" onPress={close} style={{ flex: 1 }} />
        <Button label="Save" haptic="none" onPress={save} style={{ flex: 1 }} />
      </ButtonRow>
    </Sheet>
  );
};

export default SnippetForm;
