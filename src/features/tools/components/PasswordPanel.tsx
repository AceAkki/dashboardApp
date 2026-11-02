import { useCallback, useEffect, useState } from "react";

import {
  entropyBits,
  generatePassword,
  generateToken,
  type CharsetKey,
} from "../logic/password";
import { ActionButton, Chip, ChipRow, Hint, OutputBlock, Sub, ToolPanel } from "../toolKit";

type Mode = "password" | "hex" | "base64url";

const MODES: { key: Mode; label: string }[] = [
  { key: "password", label: "PASSWORD" },
  { key: "hex", label: "HEX TOKEN" },
  { key: "base64url", label: "URL-SAFE TOKEN" },
];
const LENGTHS = [12, 16, 24, 32, 64];
const BYTES = [16, 32, 64];
const SETS: { key: CharsetKey; label: string }[] = [
  { key: "lower", label: "a-z" },
  { key: "upper", label: "A-Z" },
  { key: "digits", label: "0-9" },
  { key: "symbols", label: "#$%" },
];

export default function PasswordPanel() {
  const [mode, setMode] = useState<Mode>("password");
  const [length, setLength] = useState(16);
  const [bytes, setBytes] = useState(32);
  const [sets, setSets] = useState<CharsetKey[]>(["lower", "upper", "digits", "symbols"]);
  const [value, setValue] = useState("");

  const generate = useCallback(
    () => setValue(mode === "password" ? generatePassword(length, sets) : generateToken(bytes, mode)),
    [mode, length, bytes, sets],
  );

  // a new value whenever an option changes, and when the panel opens
  useEffect(generate, [generate]);

  // at least one character set must stay on
  const toggleSet = (key: CharsetKey) =>
    setSets((current) =>
      current.includes(key)
        ? current.length > 1
          ? current.filter((k) => k !== key)
          : current
        : [...current, key],
    );

  return (
    <ToolPanel title="PASSWORD / TOKEN">
      <ChipRow>
        {MODES.map((m) => (
          <Chip key={m.key} label={m.label} active={m.key === mode} onPress={() => setMode(m.key)} />
        ))}
      </ChipRow>

      {mode === "password" ? (
        <>
          <Sub>LENGTH</Sub>
          <ChipRow>
            {LENGTHS.map((n) => (
              <Chip key={n} label={String(n)} active={n === length} onPress={() => setLength(n)} />
            ))}
          </ChipRow>
          <Sub>CHARACTERS</Sub>
          <ChipRow>
            {SETS.map((s) => (
              <Chip key={s.key} label={s.label} active={sets.includes(s.key)} onPress={() => toggleSet(s.key)} />
            ))}
          </ChipRow>
        </>
      ) : (
        <>
          <Sub>SIZE (BYTES)</Sub>
          <ChipRow>
            {BYTES.map((n) => (
              <Chip key={n} label={String(n)} active={n === bytes} onPress={() => setBytes(n)} />
            ))}
          </ChipRow>
        </>
      )}

      <OutputBlock label="RESULT" value={value} />
      <Hint>
        ~{mode === "password" ? entropyBits(length, sets) : bytes * 8} BITS OF RANDOMNESS · MADE ON THIS PHONE, NEVER SENT ANYWHERE
      </Hint>
      <ActionButton label="GENERATE" onPress={generate} />
    </ToolPanel>
  );
}
