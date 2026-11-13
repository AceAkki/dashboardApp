import { PYTHON_SECTIONS } from "../logic/pythonCheatsheet";
import CheatsheetPanel from "./CheatsheetPanel";

export default function PythonCheatsheetPanel() {
  return <CheatsheetPanel sections={PYTHON_SECTIONS} placeholder="list · venv · f-string" />;
}
