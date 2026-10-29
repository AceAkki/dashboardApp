// Everything the dev dashboard watches.

// Statuspage.io sites: GET {base}/api/v2/status.json
export const SERVICES = [
  { name: "GitHub", base: "https://www.githubstatus.com" },
  { name: "npm", base: "https://status.npmjs.org" },
  { name: "Vercel", base: "https://www.vercel-status.com" },
  { name: "Netlify", base: "https://www.netlifystatus.com" },
  { name: "Render", base: "https://status.render.com" },
  { name: "Docker", base: "https://www.dockerstatus.com" },
  { name: "Cloudflare", base: "https://www.cloudflarestatus.com" },
  { name: "AWS", base: "https://status.aws.amazon.com" },
] as const;

// npm packages whose latest version is shown
export const PACKAGES = [
  "react",
  "react-native",
  "expo",
  "expo-router",
  "@expo/vector-icon",
  "zustand",
  "motion",
] as const;

// GitHub "owner/repo" whose latest release is shown (unauthenticated: 60 requests/hour)
export const REPOS = [
  "facebook/react-native",
  "expo/expo",
  "facebook/react",
] as const;

// how long a fetched result is reused before asking the network again
export const TTL = {
  stories: 10 * 60 * 1000,
  status: 5 * 60 * 1000,
  packages: 60 * 60 * 1000,
  releases: 30 * 60 * 1000,
};
