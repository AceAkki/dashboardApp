import {
  DEFAULT_KIND,
  TASK_FLAGS,
  getTaskTypes,
  kindFromFlag,
  taskFlagOf,
} from "@/features/tasks/taskTypeUtils";
import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";
import { useToolsStore } from "./useToolsStore";

export type CommandResult = { ok: boolean; message: string };

export const GO_ROUTES = {
  home: "/",
  tasks: "/TaskManager",
  feed: "/Feed",
  tools: "/Tools",
  me: "/UserProfile",
  vault: "/SnippetVault",
} as const;

// built from the task types, so renaming a type updates the help text too
const TASK_USAGE = `task <text> [${TASK_FLAGS.join("|")}]`;

// shown as the placeholder of the terminal input
export const TASK_EXAMPLE =
  `task fix auth bug ${TASK_FLAGS.find((f) => f !== taskFlagOf(DEFAULT_KIND)) ?? ""}`.trim();

export const HELP = `\n${TASK_USAGE} \nnote <text> \ntimer start|pause|reset \ngo home|tasks|feed|tools`;

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// Runs one line typed into the terminal. `navigate` is passed in so this file stays free of React hooks.
export function runCommand(
  line: string,
  navigate: (path: string) => void,
): CommandResult {
  const input = line.trim();
  if (!input) return { ok: false, message: "EMPTY COMMAND · TYPE help" };

  const [cmd, ...rest] = input.split(/\s+/);

  switch (cmd.toLowerCase()) {
    case "help":
      return { ok: true, message: HELP };

    case "task": {
      const task = rest.join(" ").trim();
      if (!task) return { ok: false, message: `USAGE: ${TASK_USAGE}` };
      const flag = rest.find((w) => kindFromFlag(w));
      const kind = (flag && kindFromFlag(flag)) || DEFAULT_KIND;
      const name = rest
        .filter((w) => w !== flag)
        .join(" ")
        .trim();
      if (!name) return { ok: false, message: "TASK NEEDS A NAME" };
      useTaskStore.getState().updateTasks({
        id: makeId(),
        taskName: name,
        type: getTaskTypes(kind),
        remindTime: "",
      });
      return {
        ok: true,
        message: `TASK ADDED · ${kind.toUpperCase()}`,
      };
    }

    case "note": {
      const note = rest.join(" ").trim();
      if (!note) return { ok: false, message: "USAGE: note <text>" };
      useToolsStore.getState().appendToday(note);
      return { ok: true, message: "ADDED TO STANDUP · TODAY" };
    }

    case "snipe": {
      const snipe = rest.join(" ").trim();
      if (!snipe) return { ok: false, message: "USAGE: snipe <title> | <code>" };
      const [title, code] = snipe.split("|");
      useToolsStore.getState().addSnippet(title, code);
      return { ok: true, message: "ADDED TO Snippet" };
    }

    case "timer": {
      const action = rest[0]?.toLowerCase();
      const pomo = usePomodoroStore.getState();
      if (action === "start") pomo.start();
      else if (action === "pause") pomo.pause();
      else if (action === "reset") pomo.reset();
      else return { ok: false, message: "USAGE: timer start|pause|reset" };
      return { ok: true, message: `TIMER ${action.toUpperCase()}` };
    }

    case "go": {
      const target = rest[0]?.toLowerCase() as
        | keyof typeof GO_ROUTES
        | undefined;
      if (!target || !(target in GO_ROUTES)) {
        return { ok: false, message: "USAGE: go home|tasks|feed|tools|me" };
      }
      navigate(GO_ROUTES[target]);
      return { ok: true, message: `OPENING ${target.toUpperCase()}` };
    }

    default:
      return { ok: false, message: `UNKNOWN COMMAND: ${cmd} · TYPE help` };
  }
}
