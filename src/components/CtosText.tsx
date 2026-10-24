import { Text, type GestureResponderEvent, type TextProps } from "react-native";
import { useCtosText } from "@/global/useCtosText";

// <Text> that reveals itself with the CTOS scramble effect.
// Drop-in replacement for Text: style, numberOfLines etc. all pass through.
//
//   <CtosText style={...}>Productivity</CtosText>          plays on mount / text change
//   <CtosText style={...}>Hello, {name}</CtosText>         mixed strings + numbers are fine
//   <CtosText autoPlay={false} playOnPress>REFRESH</CtosText>   plays when pressed
//   <CtosText autoPlay={false} trigger={flag ? 1 : undefined}>X</CtosText>
//                                                          plays whenever trigger changes
//
// duration  ms for the reveal (default 600)
// autoPlay  false = no animation on mount / text change
// playOnPress  pressing the text replays it (your onPress still runs)
// trigger   replays when it changes; undefined = ignored

type Piece = string | number | null | undefined | false;

type Props = Omit<TextProps, "children"> & {
  children: Piece | Piece[];
  duration?: number;
  autoPlay?: boolean;
  playOnPress?: boolean;
  trigger?: string | number | boolean;
};

export default function CtosText({
  children,
  duration,
  autoPlay = true,
  playOnPress = false,
  trigger,
  onPress,
  ...rest
}: Props) {
  const value = (Array.isArray(children) ? children : [children])
    .filter((c) => c !== null && c !== undefined && c !== false)
    .join("");
  const { text, play } = useCtosText(value, { duration, autoPlay, trigger });

  const handlePress =
    playOnPress || onPress
      ? (e: GestureResponderEvent) => {
          if (playOnPress) play();
          onPress?.(e);
        }
      : undefined;

  return (
    <Text {...rest} onPress={handlePress}>
      {text}
    </Text>
  );
}
