import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { text } from "./globalStyles";

const homeStyles = StyleSheet.create({
  greet: { ...text.small, color: Colors.primary },
  greetName: { ...text.small, color: Colors.primary },
});

export default homeStyles;
