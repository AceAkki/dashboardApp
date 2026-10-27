import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  chipActiveBase,
  chipBase,
  fieldBase,
  fontSize,
  primaryBtnBase,
  text,
} from "@/style/globalStyles";

const taskManagerStyles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: { ...text.title },
  tabs: {
    flexDirection: "row",
    gap: 2,
    marginHorizontal:5
  },
  tab: { ...chipBase},
  tabActive: { ...chipActiveBase },
  tabTxt: { ...text.small, fontSize: fontSize.md },
  tabTxtActive: { color: Colors.primary },
  tasksGridWrap: {
    flex: 1,
    gap: 24,
  },
  form: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  formInput: { ...fieldBase, flex: 1 },
  formBtn: { ...primaryBtnBase },
  formBtnTxt: { ...text.btn, fontSize: 16, textAlign: "center" },
});

export default taskManagerStyles;
