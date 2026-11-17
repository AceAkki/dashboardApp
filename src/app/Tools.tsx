import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import CtosScreen from "@/components/ctos/CtosScreen";
import EmptyState from "@/components/ctos/EmptyState";
import SearchField from "@/components/ctos/SearchField";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";
import globalStyles from "@/style/globalStyles";
import TerminalPanel from "@/features/tools/components/TerminalPanel";
import { ToolGroup, ToolTile } from "@/features/tools/toolKit";
import { TOOL_GROUPS, TOOL_PANELS } from "@/features/tools/toolPanels";
import { APP_TAG } from "@/global/appInfo";

import toolsStyles from "@/features/tools/toolsStyles";

// Every tool opens in app/Tool.tsx (/Tool?id=...). The list is in features/tools/toolPanels.ts.
const ALL_TOOLS = TOOL_PANELS.map((t) => ({
  key: t.id,
  title: t.title,
  blurb: t.blurb,
  icon: t.icon,
  group: t.group,
  href: `/Tool?id=${t.id}`,
}));

export default function Tools() {
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_TOOLS;
    return ALL_TOOLS.filter((t) =>
      `${t.title} ${t.blurb} ${t.group}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <CtosScreen nav>
      <ScrollView
        contentContainerStyle={toolsStyles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={globalStyles.sectionLabel}>{`${APP_TAG}Toolkit`}</Text>
          <View style={toolsStyles.headRow}>
            <CtosText style={[globalStyles.textHeading, { marginTop: 6 }]}>
              Utilities
            </CtosText>
            <Text style={toolsStyles.count}>{ALL_TOOLS.length} TOOLS</Text>
          </View>
        </View>

        <Panel title="Terminal">
          <TerminalPanel />
        </Panel>

        <SearchField value={query} onChangeText={setQuery} placeholder="filter tools…" />

        {TOOL_GROUPS.map((group) => {
          const items = shown.filter((t) => t.group === group);
          if (items.length === 0) return null;
          return (
            <ToolGroup key={group} title={group} count={items.length}>
              {items.map((t) => (
                <ToolTile
                  key={t.key}
                  href={t.href}
                  title={t.title}
                  blurb={t.blurb}
                  iconName={t.icon}
                />
              ))}
            </ToolGroup>
          );
        })}

        {shown.length === 0 ? (
          <EmptyState text={`no tool matches "${query.trim()}"`} />
        ) : null}
      </ScrollView>
    </CtosScreen>
  );
}
