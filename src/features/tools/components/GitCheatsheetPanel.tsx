import { GIT_SECTIONS } from "../logic/gitCheatsheet";
import CheatsheetPanel from "./CheatsheetPanel";

export default function GitCheatsheetPanel() {
  return <CheatsheetPanel sections={GIT_SECTIONS} placeholder="stash · undo · rebase" />;
}
