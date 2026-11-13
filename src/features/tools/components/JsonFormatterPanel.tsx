import { useMemo, useState } from "react";

import Panel from "@/components/ctos/Panel";
import { formatJson, INDENTS, jsonError, minifyJson, type JsonIndent } from "../logic/json";
import {
  ActionButton,
  ButtonRow,
  Chip,
  ChipRow,
  Field,
  Hint,
  OutputBlock,
  Stack,
  Status,
} from "../toolKit";

export default function JsonFormatterPanel() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<JsonIndent>(2);
  const [sorted, setSorted] = useState(false);
  const [output, setOutput] = useState("");

  const hasInput = input.trim() !== "";
  const error = useMemo(() => (hasInput ? jsonError(input) : null), [input, hasInput]);
  const valid = hasInput && error === null;

  // the old result no longer matches the new text, so it goes away
  const edit = (text: string) => {
    setInput(text);
    setOutput("");
  };

  return (
    <>
      <Panel title="INPUT">
        <Stack>
          <Field label="JSON" value={input} onChangeText={edit} placeholder='{"name": "ctOS"}' multiline />
          {!hasInput ? <Hint>PASTE JSON ABOVE. IT IS CHECKED AS YOU TYPE.</Hint> : null}
          {valid ? <Status tone="ok">VALID JSON</Status> : null}
          {error ? <Status tone="error">{error}</Status> : null}

          <ChipRow>
            {INDENTS.map((i) => (
              <Chip key={i.label} label={i.label} active={i.value === indent} onPress={() => setIndent(i.value)} />
            ))}
            <Chip label="SORT KEYS" active={sorted} onPress={() => setSorted((s) => !s)} />
          </ChipRow>

          <ButtonRow>
            <ActionButton label="FORMAT" disabled={!valid} onPress={() => setOutput(formatJson(input, indent, sorted))} />
            <ActionButton ghost label="MINIFY" disabled={!valid} onPress={() => setOutput(minifyJson(input))} />
          </ButtonRow>
        </Stack>
      </Panel>

      {output ? (
        <Panel title="OUTPUT">
          <OutputBlock label="RESULT" value={output} />
        </Panel>
      ) : null}
    </>
  );
}
