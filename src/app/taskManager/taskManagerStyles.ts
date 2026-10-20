import { colors } from "@/style/globalStyles";
import { StyleSheet } from "react-native";

const taskManagerStyles = StyleSheet.create({
  tasksGridWrap: {
    gap:1
  },
  form:{
    alignItems:"center",
    gap:0.5,
    marginBottom:1
  },
  formInput:{
    alignItems:"center",
    gap:0.5,
    paddingHorizontal:0.5,
    backgroundColor:colors.primary,
    borderColor:colors.border,
    borderWidth: 2,
    borderRadius:10
  },
  formBtn:{
    alignItems:"center",
    gap:0.5,
    paddingHorizontal:0.5,
    backgroundColor:colors.orange,
    color:colors.primary,
    borderWidth: 2,
    borderRadius:10,
    fontSize:1,
    textAlign:"center"
  }
});

export default taskManagerStyles;
