import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { Modal, Text, View } from "react-native";

import CtosPressable from "@/components/ctos/CtosPressable";
import FocusInput from "@/components/ctos/FocusInput";
import { feedback } from "@/global/useFeedback";

import { useToolsStore } from "../hooks/useToolsStore";
import { cleanTag, tagCounts } from "../snippetTags";

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import styles from "../toolsStyles";

const SnippetForm = () => {
  const {
    snippets,
    addSnippet,
    updateSnippet,
    snippetID,
    setSnippetID,
    toggleIsPopupOpen,
  } =
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

  const selectedSnippet = snippetID
    ? snippets.find((s) => s.id === snippetID)
    : null;
  const editTitle = selectedSnippet ? selectedSnippet.title : "";
  const editCode = selectedSnippet ? selectedSnippet.code : "";

  const [title, setTitle] = useState(editTitle);
  const [code, setCode] = useState(editCode);
  const [tag, setTag] = useState(selectedSnippet?.tag ?? "");
  const known = tagCounts(snippets).slice(0, 8);
  const currentTag = cleanTag(tag);

  const [tried, setTried] = useState(false);

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
    // so the next "+ NEW" is a new snippet, not an edit of this one
    setSnippetID(null);
    toggleIsPopupOpen();
  };

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.editSnippetForm}>
        <View style={styles.editSnippetContent}>
          <View style={styles.snippetHead}>
            <Text style={globalStyles.sectionSubTitle}>
              {selectedSnippet ? "Edit" : "New"} Snippet
            </Text>

            <CtosPressable
              style={[styles.addBtn,]}
              onPress={() => {
                setSnippetID(null);
                toggleIsPopupOpen();
              }}
            >
              <Ionicons
                name="close-outline"
                size={20}
                color={Colors.textOnPrimary}
              />
            </CtosPressable>
          </View>
          <View style={styles.addForm}>
            <FocusInput
              style={styles.addInput}
              value={title}
              onChangeText={setTitle}
              error={tried && !title.trim()}
              placeholder="title"
              placeholderTextColor={Colors.textMuted}
            />
            <FocusInput
              style={styles.addCode}
              value={code}
              onChangeText={setCode}
              error={tried && !code.trim()}
              placeholder="command, code or note"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
            />
            <FocusInput
              style={styles.addInput}
              value={tag}
              onChangeText={setTag}
              placeholder="tag (optional): git, docker, notes"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
            />
            {known.length > 0 ? (
              <View style={styles.tagChips}>
                {known.map((t) => (
                  <CtosPressable
                    haptic="select"
                    key={t.tag}
                    style={[
                      globalStyles.chip,
                      currentTag === t.tag && globalStyles.chipActive,
                    ]}
                    onPress={() => setTag(currentTag === t.tag ? "" : t.tag)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: currentTag === t.tag }}
                  >
                    <Text
                      style={[
                        globalStyles.textSmall,
                        currentTag === t.tag && { color: Colors.primary },
                      ]}
                    >
                      #{t.tag}
                    </Text>
                  </CtosPressable>
                ))}
              </View>
            ) : null}
            <CtosPressable haptic="none" style={styles.addBtn} pressedStyle={{ opacity: 0.7 }} onPress={save}>
              <Text style={globalStyles.primaryBtnTxt}>Save</Text>
            </CtosPressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SnippetForm;
