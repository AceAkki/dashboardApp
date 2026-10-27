import { createContext } from "react";

// Tiny shared flag: "has the block I'm inside appeared yet?"
// Defaults to true, so a <CtosText> used anywhere else is completely unaffected.
// <CtosItem> sets it to false until it reveals; <CtosText> reads it.
export const CtosRevealContext = createContext(true);
