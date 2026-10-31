declare global {
  interface String {
    toSentenceCase(): string;
  }
}

String.prototype.toSentenceCase = function (): string {
  return this.split("")
    .map((char, i) => (i === 0 ? char.toUpperCase() : char))
    .join("");
};

export {};
