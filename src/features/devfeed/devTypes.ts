export type StorySource = "hn" | "dev" | "lobsters";

export interface Story {
  id: string;
  title: string;
  url: string;
  discussionUrl: string;
  points: number;
  comments: number;
  /** unix seconds */
  time: number;
  source: StorySource;
}

export type StatusLevel = "ok" | "minor" | "major" | "critical" | "unknown";

export interface ServiceStatus {
  name: string;
  level: StatusLevel;
  description: string;
}

export interface PackageVersion {
  name: string;
  version: string | null;
}

export interface RepoRelease {
  repo: string;
  tag: string | null;
  url: string;
  /** ISO date */
  publishedAt: string | null;
}
