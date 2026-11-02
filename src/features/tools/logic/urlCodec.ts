// "component": for one piece of a URL (a query value, a path part). Encodes / ? & = # too.
// "full":      for a whole URL. Leaves / ? & = # alone so the URL keeps its shape.
export type UrlScope = "component" | "full";

export function encodeUrl(text: string, scope: UrlScope): string {
  return scope === "component" ? encodeURIComponent(text) : encodeURI(text);
}

// Throws "NOT VALID URL ENCODING" for a broken sequence such as "%E0%A4%A"
export function decodeUrl(text: string, scope: UrlScope): string {
  try {
    return scope === "component" ? decodeURIComponent(text) : decodeURI(text);
  } catch {
    throw new Error("NOT VALID URL ENCODING");
  }
}
