import TabBar from "@/components/ctos/TabBar";

import type { RouteType } from "../taskTypes";
import { ALL_TAB } from "../taskTypeUtils";

type Props = {
  routes: RouteType[];
  index: number;
  onChange: (index: number) => void;
  /** number shown above each label, keyed by route key */
  counts: Record<string, number>;
};

// The task screen's tabs: the shared TabBar fed with the task routes.
export default function TaskTabs({ routes, index, onChange, counts }: Props) {
  const tabs = routes.map((r) => ({
    key: r.key,
    label: r.key === ALL_TAB ? "ALL" : r.key,
    count: counts[r.key] ?? 0,
  }));
  return <TabBar tabs={tabs} index={index} onChange={onChange} />;
}
