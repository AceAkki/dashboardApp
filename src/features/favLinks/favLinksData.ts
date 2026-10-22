import type { FavLinkGroups } from "./favLinkTypes";

// https (the web version used http, which iOS/Android block by default)
const icon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

export const favLinks: FavLinkGroups = {
  SearchLinks: [
    {
      name: "DuckDuckGo",
      favicon: icon("https://duckduckgo.com"),
      searchURL: "https://duckduckgo.com/?q=",
    },
    {
      name: "Brave Search",
      favicon: icon("https://search.brave.com"),
      searchURL: "https://search.brave.com/search?q=",
    },
    {
      name: "Google",
      favicon: icon("https://www.google.com"),
      searchURL: "https://www.google.com/search?q=",
    },
    {
      name: "Wikipedia",
      favicon: icon("https://en.wikipedia.org"),
      searchURL: "https://en.wikipedia.org/wiki/Special:Search/",
    },
    {
      name: "Youtube",
      favicon: icon("https://www.youtube.com"),
      searchURL: "https://www.youtube.com/results?search_query=",
    },
    {
      name: "Microsoft Bing",
      favicon: icon("https://www.bing.com"),
      searchURL: "https://www.bing.com/search?form=&q=",
    },
    {
      name: "Yandex",
      favicon: icon("https://yandex.com"),
      searchURL: "https://yandex.com/search?text=",
    },
    {
      name: "WolframAlpha",
      favicon: icon("https://www.wolframalpha.com"),
      searchURL: "https://www.wolframalpha.com/input/?i=",
    },
    {
      name: "StackOverflow",
      favicon: icon("https://stackoverflow.com"),
      searchURL: "https://stackoverflow.com/search?q=",
    },
    {
      name: "GitHub",
      favicon: icon("https://github.com"),
      searchURL: "https://github.com/search?q=",
    },
  ],
  StaticLinks: [
    {
      name: "Downdetector",
      favicon: icon("https://downdetector.com"),
      searchURL: "https://downdetector.com",
    },
    {
      name: "Threatmap",
      favicon: icon("https://threatmap.checkpoint.com"),
      searchURL: "https://threatmap.checkpoint.com",
    },
    {
      name: "SpeedTest",
      favicon: icon("https://fast.com"),
      searchURL: "https://fast.com",
    },
    {
      name: "Wayback",
      favicon: icon("https://archive.org"),
      searchURL: "https://archive.org/web/",
    },
  ],
};
