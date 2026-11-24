import { useLocalSearchParams } from "expo-router";

import Panel from "@/components/ctos/Panel";
import Status from "@/components/ctos/Status";
import { ToolScreen } from "@/features/tools/toolKit";
import { findToolPanel } from "@/features/tools/toolPanels";

// The list of tools is in features/tools/toolPanels.ts.
export default function Tool() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const tool = findToolPanel(id);

  if (!tool) {
    return (
      <ToolScreen title="Unknown tool">
        <Status tone="err">NO TOOL CALLED "{id ?? ""}"</Status>
      </ToolScreen>
    );
  }

  const { Component, bare, fill } = tool;
  return (
    <ToolScreen title={tool.title} scroll={!fill}>
      {bare  || fill ? (
        <Component />
      ) : (
        <Panel>
          <Component />
        </Panel>
      )}
    </ToolScreen>
  );
}
