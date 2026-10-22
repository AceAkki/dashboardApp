import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const taskManagerStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.secondarySoft,
  },
  tabTxt: {
    color: Colors.border,
  },
  tabTxtActive: {
    color: Colors.primary,
  },
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
  formInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: Colors.primary,
    borderColor: Colors.border,
    borderWidth: 2,
    borderRadius: 10,
  },
  formBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 10,
  },
  formBtnTxt: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
});

export default taskManagerStyles;
