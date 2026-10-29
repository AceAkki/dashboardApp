import { Pressable, Text, View } from "react-native";

import type { RouteType } from "../taskTypes";
import taskManagerStyles from "./taskManagerStyles";

type Props = {
  routes: RouteType[];
  index: number;
  onChange: (index: number) => void;
  /** number shown above each label, keyed by route key */
  counts: Record<string, number>;
};

const pad = (n: number) => String(n).padStart(2, "0");

// Equal-width tabs: count over label, glowing underline on the active one.
// Stretches over the full width, so there is no stray gap between tabs.
export default function TaskTabs({ routes, index, onChange, counts }: Props) {
  return (
    <View style={taskManagerStyles.tabsRow}>
      {routes.map((route, i) => {
        const on = i === index;
        return (
          <Pressable
            key={route.key}
            style={taskManagerStyles.tabItem}
            onPress={() => onChange(i)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            <Text style={[taskManagerStyles.tabCount, on && taskManagerStyles.tabCountOn]}>
              {pad(counts[route.key] ?? 0)}
            </Text>
            <Text style={[taskManagerStyles.tabLabel, on && taskManagerStyles.tabLabelOn]}>
              {route.key === "*/" ? "ALL" : route.key.toUpperCase()}
            </Text>
            {on ? <View style={taskManagerStyles.tabUnderline} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}
