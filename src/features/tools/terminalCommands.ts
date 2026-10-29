import { getTaskTypes } from "@/features/tasks/taskTypeUtils";
import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";
import { useToolsStore } from "./useToolsStore";

export type CommandResult = { ok: boolean; message: string };

export const GO_ROUTES = {
  home: "/",
  tasks: "/TaskManager",
  feed: "/Feed",
  tools: "/Tools",
} as const;

export const HELP =
  "add task <text> [--urgent|--done] · note <text> · timer start|pause|reset · go home|tasks|feed|tools";

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// index into TABS: 1 = active, 2 = urgent, 3 = done
const FLAG_INDEX: Record<string, number> = { "--urgent": 2, "--done": 3, "--active": 1 };

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

    case "add": {
      if (rest[0]?.toLowerCase() !== "task") {
        return { ok: false, message: "USAGE: add task <text> [--urgent|--done]" };
      }
      const words = rest.slice(1);
      const flag = words.find((w) => w.toLowerCase() in FLAG_INDEX);
      const name = words.filter((w) => w !== flag).join(" ").trim();
      if (!name) return { ok: false, message: "TASK NEEDS A NAME" };
      useTaskStore.getState().updateTasks({
        id: makeId(),
        taskName: name,
        type: getTaskTypes(flag ? FLAG_INDEX[flag.toLowerCase()] : 1),
        remindTime: "",
      });
      return { ok: true, message: `TASK ADDED · ${flag ? flag.slice(2).toUpperCase() : "ACTIVE"}` };
    }

    case "note": {
      const note = rest.join(" ").trim();
      if (!note) return { ok: false, message: "USAGE: note <text>" };
      useToolsStore.getState().appendToday(note);
      return { ok: true, message: "ADDED TO STANDUP · TODAY" };
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
      const target = rest[0]?.toLowerCase() as keyof typeof GO_ROUTES | undefined;
      if (!target || !(target in GO_ROUTES)) {
        return { ok: false, message: "USAGE: go home|tasks|feed|tools" };
      }
      navigate(GO_ROUTES[target]);
      return { ok: true, message: `OPENING ${target.toUpperCase()}` };
    }

    default:
      return { ok: false, message: `UNKNOWN COMMAND: ${cmd} · TYPE help` };
  }
}
