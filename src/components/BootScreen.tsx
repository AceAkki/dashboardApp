import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import CtosText from "@/components/CtosText";
import { Colors } from "@/constants/Colors";
import { screenBase, spacing, text } from "@/style/globalStyles";
import { useUserStore } from "@/features/auth/useAuthStore";

// CTOS-style boot screen. Shown once per app launch, right after the native
// splash hides, so the scramble effect plays on a screen you can actually see.
// Tap anywhere to skip.

const LINE_DELAY = 1250; // ms between lines
const HOLD = 1900; // ms to hold after the last line

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const username = useUserStore((s) => s.username);

  const lines = [
    "CTOS // BOOT SEQUENCE [ACTIVE]",
    "KERNEL: INITIALIZING SECURE MODULES...",
    "VERIFYING SESSION... [OK]",
    "LOADING MODULES",
    "LOADING CORE MODULES:",
    " - ctos.core.netlib",
    " - ctos.core.datalake",
    " - ctos.ui.obsidian",
    " - dev.api.iotogrotions",
    "LOADING EXTERNAL APIS:",
    " - api.github.com",
    " - api.openweather.com",
    "SECURE KEY EXCHANGE INITIALIZED",
    `USER IDENTIFIED: ${username}`,
    username ? `WELCOME, ${username}` : "AUTHENTICATION REQUIRED",
    "SYSTEM READY. INITIALIZING DASHBOARD...",
  ];

  const [shown, setShown] = useState(1);

  useEffect(() => {
    if (shown < lines.length) {
      const t = setTimeout(() => setShown((n) => n + 1), LINE_DELAY);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, HOLD);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  return (
    <Pressable style={styles.root} onPress={onDone}>
      <View style={styles.block}>
        {lines.slice(0, shown).map((line, i) => (
          <CtosText
            key={i}
            style={[styles.line, i === lines.length - 1 && styles.lineFinal]}
          >
            {line}
          </CtosText>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { ...screenBase, justifyContent: "center", padding: spacing.xl },
  block: { gap: spacing.md },
  line: { ...text.small, letterSpacing: 1 },
  lineFinal: { ...text.cardTitle, color: Colors.primary, letterSpacing: 1 },
});
