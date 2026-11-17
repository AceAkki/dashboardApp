import { useMemo, useState } from "react";

import { decodeBase64, encodeBase64 } from "../logic/base64";
import ChipRow from "@/components/ctos/ChipRow";
import OutputBlock from "@/components/ctos/OutputBlock";
import Status from "@/components/ctos/Status";
import { Chip, Field, Stack } from "../toolKit";

export default function Base64Panel() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState("");

  // runs on every change; decoding can fail, so the error is kept as a result too
  const result = useMemo(() => {
    if (!input) return null;
    try {
      return {
        out:
          mode === "encode"
            ? encodeBase64(input, urlSafe)
            : decodeBase64(input),
      };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [input, mode, urlSafe]);

  return (
    <Stack>
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
        {mode === "encode" ? (
          <Chip
            label="URL-SAFE"
            active={urlSafe}
            onPress={() => setUrlSafe((u) => !u)}
          />
        ) : null}
      </ChipRow>
      <Field
        label={mode === "encode" ? "TEXT" : "BASE64"}
        value={input}
        onChangeText={setInput}
        placeholder={mode === "encode" ? "text to encode" : "SGVsbG8="}
        multiline
      />
      {result?.error ? <Status tone="err">{result.error}</Status> : null}
      {result?.out !== undefined ? (
        <OutputBlock label="RESULT" value={result.out} />
      ) : null}
    </Stack>
  );
}
