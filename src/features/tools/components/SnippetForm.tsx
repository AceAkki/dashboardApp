import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { useToolsStore, type ToolsState } from "../useToolsStore";

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import styles from "../toolsStyles";

const SnippetForm = () => {
  const {
    snippets,
    addSnippet,
    snippetID,
    setSnippetID,
    isPopupOpen,
    toggleIsPopupOpen,
  } = useToolsStore<ToolsState>(
    useShallow((s) => ({
      snippets: s.snippets,
      addSnippet: s.addSnippet,
      snippetID: s.snippetID,
      setSnippetID: s.setSnippetID,
      isPopupOpen: s.isPopupOpen,
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

  const save = () => {
    if (!title.trim() || !code.trim()) return;
    addSnippet(title.trim(), code.trim());
    setTitle("");
    setCode("");
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

            <Pressable
              style={[styles.addBtn, { alignSelf: "end", padding: 5 }]}
              onPress={() => {
                setSnippetID(null);
                toggleIsPopupOpen(() => false);
              }}
            >
              <Ionicons
                name="close-outline"
                size={20}
                color={Colors.primaryBtnText}
              />
            </Pressable>
          </View>
          <View style={styles.addForm}>
            <TextInput
              style={styles.addInput}
              value={title}
              onChangeText={setTitle}
              placeholder="title"
              placeholderTextColor={Colors.textMuted}
            />
            <TextInput
              style={styles.addCode}
              value={code}
              onChangeText={setCode}
              placeholder="command or code"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
            />
            <Pressable style={styles.addBtn} onPress={save}>
              <Text style={globalStyles.primaryBtnTxt}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SnippetForm;
