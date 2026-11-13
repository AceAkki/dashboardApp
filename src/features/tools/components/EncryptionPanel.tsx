import { useState } from "react";

import Panel from "@/components/ctos/Panel";
import useAsyncAction from "@/global/useAsyncAction";
import { decryptText, encryptText } from "../logic/cipher";
import {
  ActionButton,
  Chip,
  ChipRow,
  Field,
  Hint,
  OutputBlock,
  Stack,
  Status,
} from "../toolKit";

type Mode = "encrypt" | "decrypt";

// declared outside the component so useAsyncAction gets the same function every render
const runCipher = (mode: Mode, input: string, passphrase: string) =>
  mode === "encrypt" ? encryptText(input, passphrase) : decryptText(input, passphrase);

export default function EncryptionPanel() {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [input, setInput] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const { busy, data, error, run } = useAsyncAction(runCipher);

  return (
    <>
      <Panel title="INPUT">
        <Stack>
          <ChipRow>
            <Chip label="ENCRYPT" active={mode === "encrypt"} onPress={() => setMode("encrypt")} />
            <Chip label="DECRYPT" active={mode === "decrypt"} onPress={() => setMode("decrypt")} />
          </ChipRow>
          <Field
            label={mode === "encrypt" ? "TEXT" : "ENCRYPTED TEXT"}
            value={input}
            onChangeText={setInput}
            placeholder={mode === "encrypt" ? "text to protect" : "paste what this tool made"}
            multiline
          />
          <Field label="PASSPHRASE" value={passphrase} onChangeText={setPassphrase} placeholder="a long passphrase" secure />
          <ActionButton
            label={mode === "encrypt" ? "ENCRYPT" : "DECRYPT"}
            busy={busy}
            disabled={!input || !passphrase}
            onPress={() => run(mode, input, passphrase)}
          />
          {error ? <Status tone="error">{error}</Status> : null}
        </Stack>
      </Panel>

      {data ? (
        <Panel title="OUTPUT">
          <OutputBlock label="RESULT" value={data} />
        </Panel>
      ) : null}

      <Hint>
        AES-256-GCM · KEY MADE FROM THE PASSPHRASE WITH PBKDF2 · NOTHING LEAVES THIS PHONE. THERE IS NO RECOVERY: FORGET THE PASSPHRASE AND THE TEXT IS GONE.
      </Hint>
    </>
  );
}
