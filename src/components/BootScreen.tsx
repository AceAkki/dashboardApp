import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import CtosText from "@/components/CtosText";
import { Colors } from "@/constants/Colors";
import { spacing, text } from "@/style/globalStyles";
import CtosScreen from "@/components/ctos/CtosScreen";
import { useUserStore } from "@/features/auth/useAuthStore";
import { appName } from "@/global/globalFunctions";

// The "Fast Boot" button skips it during the first half.

const LINE_DELAY = 250; // ms between lines
const HOLD = 1900; // ms to hold after the last line

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const username = useUserStore((s) => s.username);
  const mod = appName.toLowerCase();
  const lines = [
    `[    0.000000] ${mod} kernel 1.0.0 #1 SMP PREEMPT`,
    "[    0.000000] Command line: ro quiet splash secure_boot=on",
    "[    0.004211] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point'",
    "[    0.019874] BIOS-provided physical RAM map verified",
    "[    0.042690] Memory: 7864320K available, no bad sectors",
    "[    0.118302] Booting paravirtualized kernel on bare hardware",
    "[    0.231477] Initializing cgroup subsys cpu, memory, devices",
    "[    0.402915] NET: Registered protocol family 2 (TCP/IP)",
    "[    0.610338] tls: loaded certificate store, 142 trusted roots",
    "[    0.884120] EXT4-fs (dm-0): mounted filesystem with ordered data mode",
    "[  OK  ] Reached target Local File Systems",
    "[  OK  ] Started Secure Key Exchange Service",
    "[  OK  ] Started Encrypted Local Storage",
    `[  OK  ] Started ${mod}.core.netlib`,
    `[  OK  ] Started ${mod}.core.datalake`,
    "[  OK  ] Reached target Network (Online)",
    "[  OK  ] Connected to api.github.com:443 (TLS 1.3)",
    "[  OK  ] Connected to api.open-meteo.com:443 (TLS 1.3)",
    "[  OK  ] Started Task Scheduler and Reminder Daemon",
    "[  OK  ] Started Snippet Vault Indexer",
    "[ INFO ] Verifying session token...",
    username
      ? `[  OK  ] Session verified for operator ${username}`
      : "[ WARN ] No active session found",
    "[  OK  ] Reached target Graphical Interface",
    // the last line is shown big, so it is the one that should matter
    username
      ? `ACCESS GRANTED · WELCOME, ${username.toUpperCase()}`
      : "AUTHENTICATION REQUIRED",
  ];
  const lineLength = lines.length;

  const [shown, setShown] = useState(1);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (shown < lineLength) {
      // a little pause on the "verifying" line, like a real boot waiting on something
      const lineDelay = lines[shown].includes("[ INFO ]")
        ? LINE_DELAY + 200
        : LINE_DELAY;
      const t = setTimeout(() => setShown((n) => n + 1), lineDelay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, HOLD);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  return (
    <CtosScreen>
      {/* new lines push the old ones up, like a terminal */}
      <ScrollView
        ref={scrollRef}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.log}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        {lines.slice(0, shown).map((line, i) => (
          <CtosText
            key={i}
            style={[
              styles.line,
              line.includes("[ WARN ]") && styles.warn,
              i === lineLength - 1 && styles.lineFinal,
            ]}
          >
            {line}
          </CtosText>
        ))}
      </ScrollView>

      {/* outside the ScrollView so it stays put while the log scrolls */}
      {shown < lineLength - 2 ? (
        <Pressable
          style={styles.skip}
          onPress={onDone}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Fast boot"
        >
          <Text style={styles.skipTxt}> FAST BOOT ›</Text>
        </Pressable>
      ) : null}
    </CtosScreen>
  );
}

const styles = StyleSheet.create({
  // the original look: roomy padding and gaps, small uppercase text, big cyan last line
  log: {
    padding: spacing.xl,
    justifyContent: "center",
    gap: spacing.md,
    flexGrow: 1,
  },
  line: { ...text.small, letterSpacing: 1 },
  warn: { color: Colors.danger },
  lineFinal: { ...text.cardTitle, color: Colors.primary, letterSpacing: 1 },
  skip: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  skipTxt: { ...text.small, color: Colors.primary, letterSpacing: 2 },
});
