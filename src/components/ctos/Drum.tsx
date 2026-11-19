import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { feedback } from "@/hooks/useFeedback";
import { fontSize } from "@/style/globalStyles";

export const DRUM_ITEM = 44;
const SHOWN = 5; // rows on screen; the middle one is the choice

type Props = {
  /** how many numbers: 24 for hours, 60 for minutes (0 … count-1) */
  count: number;
  value: number;
  onChange: (n: number) => void;
  label: string;
};

// One scrolling column of numbers that snaps to a row, with the row in the middle being the choice.
// Rows fade out with distance from the middle. Tapping a row scrolls it to the middle.
export default function Drum({ count, value, onChange, label }: Props) {
  const [y] = useState(() => new Animated.Value(value * DRUM_ITEM));
  const scroller = useRef<{ scrollTo: (o: { y: number; animated: boolean }) => void } | null>(null);
  const current = useRef(value);

  // the value changed from outside (quick chips): scroll there
  useEffect(() => {
    if (value === current.current) return;
    current.current = value;
    scroller.current?.scrollTo({ y: value * DRUM_ITEM, animated: true });
  }, [value]);

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
    useNativeDriver: true,
    listener: (e: unknown) => {
      const off = (e as { nativeEvent: { contentOffset: { y: number } } }).nativeEvent.contentOffset.y;
      const idx = Math.max(0, Math.min(count - 1, Math.round(off / DRUM_ITEM)));
      if (idx !== current.current) {
        current.current = idx;
        feedback.select();
        onChange(idx);
      }
    },
  });

  return (
    <View style={styles.col} accessibilityLabel={label}>
      <Animated.ScrollView
        ref={(r) => {
          scroller.current = r as unknown as typeof scroller.current;
        }}
        style={styles.list}
        contentContainerStyle={styles.pad}
        contentOffset={{ x: 0, y: value * DRUM_ITEM }}
        snapToInterval={DRUM_ITEM}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {Array.from({ length: count }, (_, i) => {
          const range = [-3, -2, -1, 0, 1, 2, 3].map((k) => (i + k) * DRUM_ITEM);
          return (
            <Pressable
              key={i}
              style={styles.row}
              onPress={() => scroller.current?.scrollTo({ y: i * DRUM_ITEM, animated: true })}
              accessibilityRole="adjustable"
            >
              <Animated.Text
                style={[
                  styles.num,
                  {
                    opacity: y.interpolate({
                      inputRange: range,
                      outputRange: [0.15, 0.35, 0.65, 1, 0.65, 0.35, 0.15],
                      extrapolate: "clamp",
                    }),
                    color: i === value ? Colors.primary : Colors.textPrimary,
                    transform: [
                      {
                        scale: y.interpolate({
                          inputRange: [(i - 1) * DRUM_ITEM, i * DRUM_ITEM, (i + 1) * DRUM_ITEM],
                          outputRange: [0.8, 1.15, 0.8],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              >
                {String(i).padStart(2, "0")}
              </Animated.Text>
            </Pressable>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  col: { flex: 1 },
  list: { height: DRUM_ITEM * SHOWN },
  pad: { paddingVertical: DRUM_ITEM * 2 },
  row: { height: DRUM_ITEM, alignItems: "center", justifyContent: "center" },
  num: { fontFamily: Typography.primary_bold, fontSize: fontSize.display_sml, letterSpacing: 2 },
});
