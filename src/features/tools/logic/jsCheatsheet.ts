import type { CheatSection } from "./cheatsheet";

export const JS_SECTIONS: CheatSection[] = [
  {
    title: "Variables & types",
    items: [
      { cmd: "const x = 1;", note: "Cannot be reassigned. Use by default" },
      { cmd: "let x = 1;", note: "Can be reassigned, block scoped" },
      { cmd: "typeof value", note: "Type as a string: 'string', 'number', 'object'..." },
      { cmd: "Array.isArray(value)", note: "True for arrays (typeof says 'object')" },
      { cmd: "Number('42')", note: "String to number (NaN if invalid)" },
      { cmd: "a ?? b", note: "b only when a is null or undefined" },
      { cmd: "obj?.a?.b", note: "Optional chaining: undefined instead of an error" },
    ],
  },
  {
    title: "Arrays",
    items: [
      { cmd: "arr.map((x) => x * 2)", note: "New array, each item transformed" },
      { cmd: "arr.filter((x) => x > 1)", note: "New array with items that pass" },
      { cmd: "arr.reduce((sum, x) => sum + x, 0)", note: "Fold the array into one value" },
      { cmd: "arr.find((x) => x.id === 3)", note: "First match, or undefined" },
      { cmd: "arr.some((x) => x > 1)", note: "True if any item passes" },
      { cmd: "arr.every((x) => x > 1)", note: "True if all items pass" },
      { cmd: "arr.includes(3)", note: "Does the array contain this value" },
      { cmd: "[...a, ...b]", note: "Join arrays (spread)" },
      { cmd: "arr.slice(1, 3)", note: "Copy a range, original untouched" },
      { cmd: "[...arr].sort((a, b) => a - b)", note: "Sort numbers on a copy" },
      { cmd: "[...new Set(arr)]", note: "Remove duplicates" },
      { cmd: "arr.flatMap((x) => [x, x])", note: "Map then flatten one level" },
    ],
  },
  {
    title: "Strings",
    items: [
      { cmd: "`Hi ${name}`", note: "Template literal" },
      { cmd: "str.split(',')", note: "String to array" },
      { cmd: "arr.join(', ')", note: "Array to string" },
      { cmd: "str.trim()", note: "Remove spaces at both ends" },
      { cmd: "str.replaceAll('a', 'b')", note: "Replace every occurrence" },
      { cmd: "str.includes('x')", note: "Does it contain this text" },
      { cmd: "str.padStart(2, '0')", note: "Pad to a length: '5' becomes '05'" },
      { cmd: "str.at(-1)", note: "Last character" },
    ],
  },
  {
    title: "Objects",
    items: [
      { cmd: "const { a, b } = obj;", note: "Destructure properties" },
      { cmd: "const { a: renamed = 0 } = obj;", note: "Rename and set a default" },
      { cmd: "{ ...obj, a: 1 }", note: "Copy an object and change a field" },
      { cmd: "Object.keys(obj)", note: "Array of keys" },
      { cmd: "Object.entries(obj)", note: "Array of [key, value] pairs" },
      { cmd: "Object.fromEntries(entries)", note: "Pairs back to an object" },
      { cmd: "structuredClone(obj)", note: "Deep copy" },
    ],
  },
  {
    title: "Functions",
    items: [
      { cmd: "const add = (a, b) => a + b;", note: "Arrow function" },
      { cmd: "function f(a, b = 2) {}", note: "Default parameter" },
      { cmd: "function f(...args) {}", note: "Rest: collect all arguments in an array" },
      { cmd: "setTimeout(fn, 1000)", note: "Run once after 1 second" },
      { cmd: "setInterval(fn, 1000)", note: "Run every second (clearInterval to stop)" },
    ],
  },
  {
    title: "Async",
    items: [
      { cmd: "const data = await promise;", note: "Wait for a promise (inside an async function)" },
      { cmd: "try { await f(); } catch (e) {}", note: "Handle async errors" },
      { cmd: "await Promise.all([a(), b()])", note: "Run in parallel, wait for all" },
      { cmd: "await Promise.allSettled([a(), b()])", note: "Wait for all, even failed ones" },
      { cmd: "await Promise.race([a(), b()])", note: "First one to finish wins" },
      { cmd: "const res = await fetch(url);", note: "HTTP request" },
      { cmd: "const json = await res.json();", note: "Read the response body as JSON" },
      {
        cmd: "fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })",
        note: "POST JSON",
      },
    ],
  },
  {
    title: "JSON, dates & regex",
    items: [
      { cmd: "JSON.stringify(obj, null, 2)", note: "Object to pretty JSON text" },
      { cmd: "JSON.parse(text)", note: "JSON text to object (throws if invalid)" },
      { cmd: "Date.now()", note: "Milliseconds since 1970" },
      { cmd: "new Date().toISOString()", note: "Current time as an ISO string (UTC)" },
      { cmd: "str.match(/\\d+/g)", note: "All matches of a regex" },
      { cmd: "/^\\S+@\\S+$/.test(str)", note: "True or false: does it match" },
    ],
  },
  {
    title: "Browser & DOM",
    items: [
      { cmd: "document.querySelector('.item')", note: "First element matching a selector" },
      { cmd: "document.querySelectorAll('.item')", note: "All matching elements" },
      { cmd: "el.addEventListener('click', fn)", note: "Listen for an event" },
      { cmd: "el.classList.toggle('on')", note: "Add or remove a class" },
      { cmd: "localStorage.setItem('k', 'v')", note: "Save a string in the browser" },
      { cmd: "localStorage.getItem('k')", note: "Read it back (null if missing)" },
    ],
  },
];
