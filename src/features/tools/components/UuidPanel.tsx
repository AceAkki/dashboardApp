import { useCallback, useEffect, useState } from "react";

import { makeUuids, type UuidVersion } from "../logic/uuid";
import { ActionButton, Chip, ChipRow, Hint, OutputBlock, Stack } from "../toolKit";

const COUNTS = [1, 5, 10];

export default function UuidPanel() {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [count, setCount] = useState(1);
  const [ids, setIds] = useState<string[]>([]);

  const generate = useCallback(
    () => setIds(makeUuids(version, count)),
    [version, count],
  );

  // new ids whenever an option changes, and when the panel opens
  useEffect(generate, [generate]);

  return (
    <Stack>
      <ChipRow>
        <Chip
          label="V4 · RANDOM"
          active={version === "v4"}
          onPress={() => setVersion("v4")}
        />
        <Chip
          label="V7 · TIME-ORDERED"
          active={version === "v7"}
          onPress={() => setVersion("v7")}
        />
      </ChipRow>
      <ChipRow>
        {COUNTS.map((n) => (
          <Chip
            key={n}
            label={`${n} ID${n > 1 ? "S" : ""}`}
            active={n === count}
            onPress={() => setCount(n)}
          />
        ))}
      </ChipRow>
      <OutputBlock label="RESULT" value={ids.join("\n")} />
      <Hint>
        V7 STARTS WITH THE TIME, SO NEW IDS SORT AFTER OLD ONES. GOOD FOR
        DATABASE KEYS.
      </Hint>
      <ActionButton label="GENERATE" onPress={generate} />
    </Stack>
  );
}
