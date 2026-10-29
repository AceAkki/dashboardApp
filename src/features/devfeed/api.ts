import { getJSON } from "@/global/useCachedFetch";
import { PACKAGES, REPOS, SERVICES } from "./devConfig";
import type {
  PackageVersion,
  RepoRelease,
  ServiceStatus,
  StatusLevel,
  Story,
} from "./devTypes";

// ---------- stories ----------

type HNHit = {
  objectID: string;
  title: string | null;
  url: string | null;
  points: number | null;
  num_comments: number | null;
  created_at_i: number;
};

export const fetchHN = async (signal?: AbortSignal): Promise<Story[]> => {
  const json = await getJSON<{ hits: HNHit[] }>(
    "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=25",
    signal,
  );
  return json.hits
    .filter((h) => h.title)
    .map((h) => {
      const discussionUrl = `https://news.ycombinator.com/item?id=${h.objectID}`;
      return {
        id: h.objectID,
        title: h.title as string,
        url: h.url ?? discussionUrl,
        discussionUrl,
        points: h.points ?? 0,
        comments: h.num_comments ?? 0,
        time: h.created_at_i,
        source: "hn" as const,
      };
    });
};

type DevArticle = {
  id: number;
  title: string;
  url: string;
  positive_reactions_count: number;
  comments_count: number;
  published_timestamp: string;
};

export const fetchDevTo = async (signal?: AbortSignal): Promise<Story[]> => {
  const json = await getJSON<DevArticle[]>(
    "https://dev.to/api/articles?top=1&per_page=25",
    signal,
  );
  return json.map((a) => ({
    id: String(a.id),
    title: a.title,
    url: a.url,
    discussionUrl: a.url,
    points: a.positive_reactions_count,
    comments: a.comments_count,
    time: Math.floor(Date.parse(a.published_timestamp) / 1000),
    source: "dev" as const,
  }));
};

type LobstersStory = {
  short_id: string;
  title: string;
  url: string;
  comments_url: string;
  score: number;
  comment_count: number;
  created_at: string;
};

export const fetchLobsters = async (signal?: AbortSignal): Promise<Story[]> => {
  const json = await getJSON<LobstersStory[]>("https://lobste.rs/hottest.json", signal);
  return json.map((s) => ({
    id: s.short_id,
    title: s.title,
    url: s.url || s.comments_url,
    discussionUrl: s.comments_url,
    points: s.score,
    comments: s.comment_count,
    time: Math.floor(Date.parse(s.created_at) / 1000),
    source: "lobsters" as const,
  }));
};

// ---------- service status ----------

const LEVELS: Record<string, StatusLevel> = {
  none: "ok",
  minor: "minor",
  major: "major",
  critical: "critical",
};

export const fetchServiceStatuses = async (signal?: AbortSignal): Promise<ServiceStatus[]> =>
  Promise.all(
    SERVICES.map(async (svc): Promise<ServiceStatus> => {
      try {
        const json = await getJSON<{ status: { indicator: string; description: string } }>(
          `${svc.base}/api/v2/status.json`,
          signal,
        );
        return {
          name: svc.name,
          level: LEVELS[json.status.indicator] ?? "unknown",
          description: json.status.description,
        };
      } catch {
        return { name: svc.name, level: "unknown", description: "No data" };
      }
    }),
  );

// ---------- npm + releases ----------

export const fetchPackageVersions = async (signal?: AbortSignal): Promise<PackageVersion[]> =>
  Promise.all(
    PACKAGES.map(async (name): Promise<PackageVersion> => {
      try {
        const json = await getJSON<{ version: string }>(
          `https://registry.npmjs.org/${name.replace("/", "%2F")}/latest`,
          signal,
        );
        return { name, version: json.version };
      } catch {
        return { name, version: null };
      }
    }),
  );

export const fetchReleases = async (signal?: AbortSignal): Promise<RepoRelease[]> =>
  Promise.all(
    REPOS.map(async (repo): Promise<RepoRelease> => {
      try {
        const json = await getJSON<{ tag_name: string; html_url: string; published_at: string }>(
          `https://api.github.com/repos/${repo}/releases/latest`,
          signal,
        );
        return { repo, tag: json.tag_name, url: json.html_url, publishedAt: json.published_at };
      } catch {
        return { repo, tag: null, url: `https://github.com/${repo}/releases`, publishedAt: null };
      }
    }),
  );
