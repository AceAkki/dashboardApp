import { StyleSheet } from "react-native";
import { colors, font } from "./globalStyles";


const homeStyles = StyleSheet.create({
  greet:{
    fontSize:15,
    color:colors.primary,
    fontFamily:font.regular
  },
  greetName:{
    fontSize:15,
    color:colors.primary,
    fontFamily:font.regular
  }
});

export default homeStyles;