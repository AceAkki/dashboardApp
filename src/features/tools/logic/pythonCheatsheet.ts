import type { CheatSection } from "./cheatsheet";

export const PYTHON_SECTIONS: CheatSection[] = [
  {
    title: "Basics",
    items: [
      { cmd: "type(x)", note: "What type is it" },
      { cmd: "isinstance(x, int)", note: "Is it this type" },
      { cmd: "int('42') · float('1.5') · str(7)", note: "Convert between types" },
      { cmd: "a, b = b, a", note: "Swap two values" },
      { cmd: "x if cond else y", note: "One-line if / else" },
      { cmd: "for i, item in enumerate(items):", note: "Loop with an index" },
      { cmd: "for a, b in zip(xs, ys):", note: "Loop over two lists together" },
      { cmd: "range(0, 10, 2)", note: "0, 2, 4, 6, 8" },
    ],
  },
  {
    title: "Strings",
    items: [
      { cmd: 'f"Hi {name}, {n:.2f}"', note: "f-string, number to 2 decimals" },
      { cmd: "s.split(',')", note: "String to list" },
      { cmd: "', '.join(items)", note: "List of strings to one string" },
      { cmd: "s.strip()", note: "Remove spaces at both ends" },
      { cmd: "s.replace('a', 'b')", note: "Replace every occurrence" },
      { cmd: "s.startswith('x') · s.endswith('x')", note: "Check the start or end" },
      { cmd: "s[::-1]", note: "Reverse a string" },
      { cmd: "s.zfill(3)", note: "Pad with zeros: '5' becomes '005'" },
    ],
  },
  {
    title: "Lists",
    items: [
      { cmd: "items.append(x)", note: "Add to the end" },
      { cmd: "items.extend(other)", note: "Add every item of another list" },
      { cmd: "items.pop()", note: "Remove and return the last item" },
      { cmd: "items.sort(key=lambda x: x[1], reverse=True)", note: "Sort in place by a field" },
      { cmd: "sorted(items)", note: "New sorted list, original untouched" },
      { cmd: "items[1:3]", note: "Slice: index 1 and 2" },
      { cmd: "items[-1]", note: "Last item" },
      { cmd: "list(set(items))", note: "Remove duplicates (order not kept)" },
      { cmd: "list(dict.fromkeys(items))", note: "Remove duplicates, keep order" },
    ],
  },
  {
    title: "Dicts & sets",
    items: [
      { cmd: "d.get('k', default)", note: "Read without a KeyError" },
      { cmd: "d.setdefault('k', [])", note: "Create the key if missing, return it" },
      { cmd: "for k, v in d.items():", note: "Loop over keys and values" },
      { cmd: "{**a, **b}", note: "Merge two dicts (b wins)" },
      { cmd: "a | b", note: "Merge dicts (3.9+), or union of sets" },
      { cmd: "{k: v for k, v in d.items() if v}", note: "Dict comprehension, drop empty values" },
      { cmd: "a & b · a - b", note: "Set intersection · difference" },
    ],
  },
  {
    title: "Comprehensions",
    items: [
      { cmd: "[x * 2 for x in nums]", note: "List comprehension (like map)" },
      { cmd: "[x for x in nums if x > 0]", note: "With a filter" },
      { cmd: "{x for x in nums}", note: "Set comprehension" },
      { cmd: "sum(x for x in nums)", note: "Generator: no list built in memory" },
      { cmd: "any(x > 0 for x in nums)", note: "True if any item passes" },
      { cmd: "all(x > 0 for x in nums)", note: "True if all items pass" },
    ],
  },
  {
    title: "Functions & classes",
    items: [
      { cmd: "def f(a, b=2, *args, **kwargs):", note: "Default, extra positional, extra keyword args" },
      { cmd: "lambda x: x * 2", note: "One-line anonymous function" },
      { cmd: "def f(x: int) -> str:", note: "Type hints (not enforced)" },
      { cmd: "class A:\n    def __init__(self, x):\n        self.x = x", note: "Class with a constructor" },
      { cmd: "@dataclass\nclass P:\n    x: int", note: "Auto __init__, __repr__ (from dataclasses)" },
      { cmd: "@property", note: "Use a method like an attribute" },
    ],
  },
  {
    title: "Errors & files",
    items: [
      { cmd: "try:\n    ...\nexcept ValueError as e:\n    ...", note: "Catch a specific error" },
      { cmd: "raise ValueError('message')", note: "Throw an error" },
      { cmd: "with open('f.txt') as f:\n    data = f.read()", note: "Read a file (closes itself)" },
      { cmd: "with open('f.txt', 'w') as f:\n    f.write(s)", note: "Write a file (replaces content)" },
      { cmd: "json.load(f) · json.dump(obj, f, indent=2)", note: "Read / write JSON files (import json)" },
      { cmd: "Path('a/b.txt').read_text()", note: "Read a file with pathlib (from pathlib import Path)" },
    ],
  },
  {
    title: "Environment & pip",
    items: [
      { cmd: "python -m venv .venv", note: "Create a virtual environment" },
      { cmd: "source .venv/bin/activate", note: "Activate it (Windows: .venv\\Scripts\\activate)" },
      { cmd: "pip install requests", note: "Install a package" },
      { cmd: "pip freeze > requirements.txt", note: "Save installed packages" },
      { cmd: "pip install -r requirements.txt", note: "Install from that file" },
      { cmd: "python -m http.server 8000", note: "Serve this folder on port 8000" },
    ],
  },
  {
    title: "Handy standard library",
    items: [
      { cmd: "from collections import Counter", note: "Counter(items).most_common(3)" },
      { cmd: "from collections import defaultdict", note: "defaultdict(list): missing keys start empty" },
      { cmd: "from datetime import datetime", note: "datetime.now().isoformat()" },
      { cmd: "import random", note: "random.choice(items) · random.randint(1, 6)" },
      { cmd: "import re", note: "re.findall(r'\\d+', s)" },
      { cmd: "if __name__ == '__main__':", note: "Run only when executed directly" },
    ],
  },
];
