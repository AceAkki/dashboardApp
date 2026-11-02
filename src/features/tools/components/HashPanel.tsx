import { useEffect, useState } from "react";

import { hashAll, type HashRow } from "../logic/hash";
import { Field, Hint, ResultRow, ToolPanel } from "../toolKit";

export default function HashPanel() {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<HashRow[]>([]);

  // hashes update as you type; `alive` drops an old result that arrives after a newer one
  useEffect(() => {
    if (!input) {
      setRows([]);
      return;
    }
    let alive = true;
    hashAll(input).then((r) => alive && setRows(r));
    return () => {
      alive = false;
    };
  }, [input]);

  return (
    <ToolPanel title="HASH GENERATOR">
      <Field label="TEXT" value={input} onChangeText={setInput} placeholder="text to hash" multiline />
      {rows.map((r) => (
        <ResultRow key={r.label} label={r.label} value={r.hex} />
      ))}
      <Hint>MD5 AND SHA-1 ARE BROKEN FOR SECURITY. USE THEM FOR CHECKSUMS ONLY.</Hint>
    </ToolPanel>
  );
}
