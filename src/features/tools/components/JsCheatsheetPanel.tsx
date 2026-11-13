import { JS_SECTIONS } from "../logic/jsCheatsheet";
import CheatsheetPanel from "./CheatsheetPanel";

export default function JsCheatsheetPanel() {
  return <CheatsheetPanel sections={JS_SECTIONS} placeholder="map · fetch · destructure" />;
}
