import {
  DEFAULT_KIND,
  TASK_FLAGS,
  getTaskTypes,
  kindFromFlag,
  taskFlagOf,
} from "@/features/tasks/taskTypeUtils";
import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";
import { useToolsStore } from "./hooks/useToolsStore";
import { launchApp } from "@/global/launcher";
import { appsIDs } from "@/global/AppsConfig";

export type CommandResult = { ok: boolean; message: string };

export const GO_ROUTES = {
  home: "/",
  tasks: "/TaskManager",
  feed: "/Feed",
  tools: "/Tools",
  me: "/UserProfile",
  vault: "/SnippetVault",

  json: "/Tool?id=json",
  regex: "/Tool?id=regex",
  diff: "/Tool?id=diff",
  encrypt: "/Tool?id=encrypt",
  status: "/Tool?id=http",
  git: "/Tool?id=git",
  js: "/Tool?id=js",
  py: "/Tool?id=python",
} as const;
const routesGo = Object.keys(GO_ROUTES);

const dividerTxt = " | ";

// built from the task types, so renaming a type updates the help text too
const TASK_USAGE = `task <text> [${TASK_FLAGS.join(dividerTxt)}]`;

// shown as the placeholder of the terminal input
export const TASK_EXAMPLE =
  `task fix auth bug ${TASK_FLAGS.find((f) => f !== taskFlagOf(DEFAULT_KIND)) ?? ""}`.trim();

export const HELP = `\n${TASK_USAGE} \n\n
note <text> \n\n
snip <title> |&| <code> \n\n
pomo start|pause|reset \n\n
go ${routesGo.join(dividerTxt)} \n\n
start ${appsIDs.join(dividerTxt)}`;

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

    case "snip": {
      const body = input.slice(cmd.length);
      const at = body.indexOf("|&|"); // the FIRST one only: the code may contain more
      if (at < 0)
        return { ok: false, message: "USAGE: snip <title> |&| <code>" };
      const title = body.slice(0, at).trim();
      const code = body.slice(at + 3).trim();
      if (!title) return { ok: false, message: "SNIPPET NEEDS A TITLE" };
      if (!code) return { ok: false, message: "SNIPPET NEEDS CODE" };
      useToolsStore.getState().addSnippet(title, code);
      return { ok: true, message: "ADDED TO Snippet" };
    }

    case "pomo": {
      const action = rest[0]?.toLowerCase();
      const pomo = usePomodoroStore.getState();
      if (action === "start") pomo.start();
      else if (action === "pause") pomo.pause();
      else if (action === "reset") pomo.reset();
      else return { ok: false, message: "USAGE: pomo start|pause|reset" };
      return { ok: true, message: `POMO ${action.toUpperCase()}` };
    }

    case "go": {
      const target = rest[0]?.toLowerCase() as
        | keyof typeof GO_ROUTES
        | undefined;
      if (!target || !Object.hasOwn(GO_ROUTES, target)) {
        return { ok: false, message: `USAGE: go <screen name>` };
      }
      navigate(GO_ROUTES[target]);
      return { ok: true, message: `OPENING ${target.toUpperCase()}` };
    }

    case "start": {
      const targetApp = rest.join("").trim().toLowerCase();
      if (!targetApp) return { ok: false, message: "USAGE: start <app name>" };
      let selectedApp = useToolsStore
        .getState()
        .apps?.find((app) => app.id === targetApp);
      if (selectedApp !== undefined) {
        setTimeout(() => launchApp(selectedApp), 1000);
        return { ok: true, message: `OPENING ${targetApp.toUpperCase()}` };
      } else {
        return {
          ok: false,
          message: `Failed to open ${targetApp.toUpperCase()}`,
        };
      }
    }

    default:
      return { ok: false, message: `UNKNOWN COMMAND: ${cmd} · TYPE help` };
  }
}
