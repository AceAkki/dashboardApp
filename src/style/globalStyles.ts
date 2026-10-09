import { StyleSheet } from "react-native";

export const colors = {
  bg: '#F6F6FC',
  card: '#FFFFFF',
  border: '#ECECF4',
  text: '#14141F',
  muted: '#7A7A8C',

  primary: '#7C5CDB',
  primarySoft: '#EEEAFB',

  peach: '#FDF1E4',
  orange: '#F5B04F',
  mint: '#EAF6EC',
  green: '#4CAF63',
  greenSoft: '#BDE4C5',
  blueSoft: '#EAEFFC',
  blue: '#5B87E8',
  yellowSoft: '#FDF3D4',
  yellow: '#F8D56B',
};

export const radius = { sm: 10, md: 16, lg: 20, pill: 999 };

export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
};

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default globalStyles;