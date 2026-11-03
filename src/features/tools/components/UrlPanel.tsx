import { useMemo, useState } from "react";

import { decodeUrl, encodeUrl, type UrlScope } from "../logic/urlCodec";
import {
  Chip,
  ChipRow,
  Field,
  Hint,
  OutputBlock,
  Status,
  ToolPanel,
} from "../toolKit";

export default function UrlPanel() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [scope, setScope] = useState<UrlScope>("component");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input) return null;
    try {
      return {
        out:
          mode === "encode" ? encodeUrl(input, scope) : decodeUrl(input, scope),
      };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [input, mode, scope]);

  return (
    <ToolPanel title="URL ENCODE / DECODE" iconName="link-outline">
      <ChipRow>
        <Chip
          label="ENCODE"
          active={mode === "encode"}
          onPress={() => setMode("encode")}
        />
        <Chip
          label="DECODE"
          active={mode === "decode"}
          onPress={() => setMode("decode")}
        />
      </ChipRow>
      <ChipRow>
        <Chip
          label="PART OF A URL"
          active={scope === "component"}
          onPress={() => setScope("component")}
        />
        <Chip
          label="WHOLE URL"
          active={scope === "full"}
          onPress={() => setScope("full")}
        />
      </ChipRow>
      <Field
        label="INPUT"
        value={input}
        onChangeText={setInput}
        placeholder={
          mode === "encode"
            ? "hello world & more"
            : "hello%20world%20%26%20more"
        }
        multiline
      />
      {result?.error ? <Status tone="error">{result.error}</Status> : null}
      {result?.out !== undefined ? (
        <OutputBlock label="RESULT" value={result.out} />
      ) : null}
      <Hint>
        PART: ENCODES / ? & = # TOO (FOR A QUERY VALUE). WHOLE: KEEPS THEM SO
        THE URL STILL WORKS.
      </Hint>
    </ToolPanel>
  );
}
