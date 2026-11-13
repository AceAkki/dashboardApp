import { Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Directory, File } from "expo-file-system";

import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import { useToolsStore } from "@/features/tools/hooks/useToolsStore";
import { useUserStore } from "@/features/auth/useAuthStore";
import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";
import { useGitStore } from "@/features/gitStats/hooks/useGitStore";
import { useWeatherStore } from "@/features/weather/hooks/useWeatherStore";
import { isGitId, parseCoord } from "@/features/auth/profileFields";
import {
  DEFAULT_KIND,
  getTaskTypes,
  taskTypesArr,
} from "@/features/tasks/taskTypeUtils";
import type { TaskActionData } from "@/features/tasks/taskTypes";
import type { StandupField, snippetType } from "@/features/tools/toolTypes";
import { feedback } from "@/global/useFeedback";
import { cleanTag } from "@/features/tools/snippetTags";

// Backup of the data that lives only on this phone: tasks, snippets, standup notes, the profile (name, GitHub ID, coordinates) and the Pomodoro session count.
// NOT included: weather and GitHub caches (they refetch by themselves) and the running timer.
// A backup is one JSON text. It can be saved as a file or copied to the clipboard, and restored from either. Everything read back is checked before it touches the stores.

const FORMAT = "terminaldeck-backup"; // fixed on purpose: renaming the app must not break old backups
const VERSION = 1;
const MAX_BYTES = 1_000_000;
const MAX_TASKS = 5000;
const MAX_SNIPPETS = 2000;
const MAX_SESSIONS = 1_000_000;
const STANDUP_FIELDS: StandupField[] = ["yesterday", "today", "blocked"];

type Standup = Record<StandupField, string>;

type Profile = {
  name: string;
  gitId: string;
  latitude: number;
  longitude: number;
};

export type Backup = {
  app: typeof FORMAT;
  version: number;
  exportedAt: string;
  tasks: TaskActionData[];
  snippets: snippetType[];
  standup: Standup;
  // older backups don't have these two
  profile?: Profile;
  pomodoro?: { completedSessions: number };
};

export type ParseResult =
  | { ok: true; backup: Backup; skipped: number }
  | { ok: false; error: string };

// ───────────────────────────── build ─────────────────────────────

export function buildBackup(): Backup {
  const u = useUserStore.getState();
  return {
    app: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    tasks: useTaskStore.getState().tasks,
    snippets: useToolsStore.getState().snippets,
    standup: useToolsStore.getState().standup,
    profile: {
      name: u.username,
      gitId: u.userID,
      latitude: u.location.latitude,
      longitude: u.location.longitude,
    },
    pomodoro: {
      completedSessions: usePomodoroStore.getState().completedSessions,
    },
  };
}

const counts = (tasks: number, snippets: number) =>
  `${tasks} task${tasks === 1 ? "" : "s"}, ${snippets} snippet${snippets === 1 ? "" : "s"}`;
export const summary = (b: Pick<Backup, "tasks" | "snippets">) =>
  counts(b.tasks.length, b.snippets.length);

// ───────────────────────────── check ─────────────────────────────

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown, max: number) =>
  typeof v === "string" && v.length <= max ? v : null;

export function parseBackup(raw: string): ParseResult {
  if (raw.length > MAX_BYTES)
    return { ok: false, error: "That text is too big to be a backup." };

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: "That isn't a valid backup (it isn't JSON)." };
  }
  if (!isObj(data) || data.app !== FORMAT) {
    return { ok: false, error: "That isn't a terminalDeck backup." };
  }
  if (typeof data.version !== "number" || data.version > VERSION) {
    return {
      ok: false,
      error: "That backup was made by a newer version of the app.",
    };
  }

  let skipped = 0;

  const tasks: TaskActionData[] = [];
  const taskIds = new Set<string>();
  for (const t of Array.isArray(data.tasks)
    ? data.tasks.slice(0, MAX_TASKS)
    : []) {
    const id = isObj(t) ? text(t.id, 100) : null;
    const name = isObj(t) ? text(t.taskName, 500) : null;
    const remind = isObj(t) ? text(t.remindTime, 40) : null;
    const validTime =
      remind !== null &&
      (remind === "" || !Number.isNaN(new Date(remind).getTime()));
    if (!isObj(t) || !id || !name?.trim() || !validTime || taskIds.has(id)) {
      skipped++;
      continue;
    }
    taskIds.add(id);
    // rebuilt from the app's own task types, so a stray or missing key can't leak in
    const rawType = isObj(t.type) ? t.type : {};
    const kind = taskTypesArr.find((k) => rawType[k] === true) ?? DEFAULT_KIND;
    tasks.push({
      id,
      taskName: name.trim(),
      remindTime: remind as string,
      type: getTaskTypes(kind),
    });
  }

  const snippets: snippetType[] = [];
  const snippetIds = new Set<string>();
  for (const s of Array.isArray(data.snippets)
    ? data.snippets.slice(0, MAX_SNIPPETS)
    : []) {
    const id = isObj(s) ? text(s.id, 100) : null;
    const title = isObj(s) ? text(s.title, 200) : null;
    const code = isObj(s) ? text(s.code, 100_000) : null;
    if (!id || !title?.trim() || !code?.trim() || snippetIds.has(id)) {
      skipped++;
      continue;
    }
    snippetIds.add(id);
    const tag = isObj(s) ? cleanTag(s.tag) : undefined;
    snippets.push(tag ? { id, title, code, tag } : { id, title, code });
  }

  const standup: Standup = { yesterday: "", today: "", blocked: "" };
  if (isObj(data.standup)) {
    for (const f of STANDUP_FIELDS)
      standup[f] = text(data.standup[f], 20_000) ?? "";
  }

  // profile: every value goes through the same checks as the login screen, or the whole part is dropped
  let profile: Profile | undefined;
  if (isObj(data.profile)) {
    const name = text(data.profile.name, 100)?.trim();
    const gitId = text(data.profile.gitId, 39)?.trim();
    const lat =
      typeof data.profile.latitude === "number"
        ? parseCoord(String(data.profile.latitude), 90)
        : null;
    const lon =
      typeof data.profile.longitude === "number"
        ? parseCoord(String(data.profile.longitude), 180)
        : null;
    if (name && gitId && isGitId(gitId) && lat !== null && lon !== null) {
      profile = { name, gitId, latitude: lat, longitude: lon };
    } else {
      skipped++;
    }
  }

  let pomodoro: Backup["pomodoro"];
  if (isObj(data.pomodoro)) {
    const n = data.pomodoro.completedSessions;
    if (
      typeof n === "number" &&
      Number.isInteger(n) &&
      n >= 0 &&
      n <= MAX_SESSIONS
    ) {
      pomodoro = { completedSessions: n };
    } else {
      skipped++;
    }
  }

  const exportedAt = typeof data.exportedAt === "string" ? data.exportedAt : "";
  return {
    ok: true,
    skipped,
    backup: {
      app: FORMAT,
      version: VERSION,
      exportedAt,
      tasks,
      snippets,
      standup,
      profile,
      pomodoro,
    },
  };
}

// ───────────────────────────── apply ─────────────────────────────

// merge: add what is missing, never change or delete what is there (standup fields and profile only fill if empty; Pomodoro keeps the higher count)
// replace: the backup becomes the data. Reminders follow by themselves: useTaskReminders watches the task store.
export function applyBackup(b: Backup, mode: "merge" | "replace") {
  const tasksNow = useTaskStore.getState().tasks;
  const { snippets: snippetsNow, standup: standupNow } =
    useToolsStore.getState();
  const user = useUserStore.getState();
  const pomo = usePomodoroStore.getState();

  let result: { tasks: number; snippets: number };

  if (mode === "replace") {
    useTaskStore.setState({ tasks: b.tasks, taskID: null });
    useToolsStore.setState({ snippets: b.snippets, standup: b.standup });
    result = { tasks: b.tasks.length, snippets: b.snippets.length };
  } else {
    const haveTask = new Set(tasksNow.map((t) => t.id));
    const newTasks = b.tasks.filter((t) => !haveTask.has(t.id));
    const haveSnippet = new Set(snippetsNow.map((s) => s.id));
    const newSnippets = b.snippets.filter((s) => !haveSnippet.has(s.id));
    const standup = { ...standupNow };
    for (const f of STANDUP_FIELDS) if (!standup[f]) standup[f] = b.standup[f];

    useTaskStore.setState({ tasks: [...tasksNow, ...newTasks] });
    useToolsStore.setState({
      snippets: [...snippetsNow, ...newSnippets],
      standup,
    });
    result = { tasks: newTasks.length, snippets: newSnippets.length };
  }

  const p = b.profile;
  if (p) {
    const noCoords =
      user.location.latitude === 0 && user.location.longitude === 0;
    const next =
      mode === "replace"
        ? p
        : {
            name: user.username || p.name,
            gitId: user.userID || p.gitId,
            latitude: noCoords ? p.latitude : user.location.latitude,
            longitude: noCoords ? p.longitude : user.location.longitude,
          };
    user.updateUser(next.name, next.latitude, next.longitude, next.gitId);
    // cached weather / GitHub data belongs to the old place and account
    if (
      next.latitude !== user.location.latitude ||
      next.longitude !== user.location.longitude
    ) {
      useWeatherStore.getState().invalidate();
    }
    if (next.gitId !== user.userID) useGitStore.getState().invalidate();
  }

  if (b.pomodoro) {
    const n =
      mode === "replace"
        ? b.pomodoro.completedSessions
        : Math.max(pomo.completedSessions, b.pomodoro.completedSessions);
    usePomodoroStore.setState({ completedSessions: n });
  }

  return result;
}

// ───────────────────────────── export ─────────────────────────────

const fail = (title: string, e: unknown) => {
  feedback.error("BACKUP FAILED");
  Alert.alert(title, e instanceof Error ? e.message : "Something went wrong.");
};
const cancelled = (e: unknown) =>
  e instanceof Error && /cancel/i.test(e.message);

export async function exportToFile() {
  try {
    const b = buildBackup();
    // the system folder picker: on Android it includes Google Drive
    const folder = await Directory.pickDirectoryAsync();
    const day = new Date().toISOString().slice(0, 10);
    const file = folder.createFile(
      `terminaldeck-backup-${day}.json`,
      "application/json",
    );
    file.write(JSON.stringify(b, null, 2));
    feedback.success("BACKUP SAVED");
    Alert.alert("Backup saved", `${summary(b)} saved as ${file.name}.`);
  } catch (e) {
    if (!cancelled(e)) fail("Couldn't save the backup", e);
  }
}

export async function exportToClipboard() {
  try {
    const b = buildBackup();
    await Clipboard.setStringAsync(JSON.stringify(b));
    feedback.success("BACKUP COPIED");
    Alert.alert(
      "Backup copied",
      `${summary(b)} copied. Paste it somewhere safe (notes, email): the clipboard is wiped when you copy something else.`,
    );
  } catch (e) {
    fail("Couldn't copy the backup", e);
  }
}

// ───────────────────────────── import ─────────────────────────────

async function readFile(): Promise<string | null> {
  const picked = await File.pickFileAsync({ mimeTypes: "*/*" });
  if (picked.canceled) return null;
  const file = picked.result;
  if ((file.size ?? 0) > MAX_BYTES)
    throw new Error("That file is too big to be a backup.");
  return file.text();
}

export async function importBackup(source: "file" | "clipboard") {
  try {
    const raw =
      source === "file" ? await readFile() : await Clipboard.getStringAsync();
    if (raw === null) return; // picker closed
    if (!raw.trim()) throw new Error("The clipboard is empty.");

    const res = parseBackup(raw);
    if (!res.ok) {
      feedback.error("NOT A VALID BACKUP");
      Alert.alert("Can't import", res.error);
      return;
    }

    const { backup, skipped } = res;
    const when = backup.exportedAt
      ? new Date(backup.exportedAt).toLocaleDateString()
      : "unknown date";
    const note =
      skipped > 0
        ? `\n${skipped} damaged item${skipped === 1 ? "" : "s"} will be skipped.`
        : "";
    Alert.alert(
      "Import backup?",
      `${summary(backup)}, saved ${when}.${note}\n\nMerge adds what's missing and keeps everything you have. Replace overwrites your tasks, snippets, notes, profile and Pomodoro count.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Merge",
          onPress: () => {
            const n = applyBackup(backup, "merge");
            feedback.success("BACKUP MERGED");
            Alert.alert("Merged", `Added ${counts(n.tasks, n.snippets)}.`);
          },
        },
        {
          text: "Replace",
          style: "destructive",
          onPress: () => {
            const n = applyBackup(backup, "replace");
            feedback.success("BACKUP RESTORED");
            Alert.alert("Restored", `${counts(n.tasks, n.snippets)} restored.`);
          },
        },
      ],
    );
  } catch (e) {
    if (!cancelled(e)) fail("Couldn't import the backup", e);
  }
}
