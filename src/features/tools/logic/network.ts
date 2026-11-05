import { Platform } from "react-native";

import { statusName } from "./httpStatus";

// Everything here is a plain fetch to a public, keyless service (or to the target itself).
// Every function throws an Error with a short readable message; screens show it as is.

// fetch with a time limit. Plain fetch can wait for a minute or more.
async function timedFetch(url: string, init: RequestInit, timeoutMs: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw new Error("TIMED OUT");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// "https://github.com:443/a/b" -> "github.com"
export function cleanHost(input: string): string {
  const host = input
    .trim()
    .replace(/^[a-z]+:\/\//i, "")
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, "");
  if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i.test(host)) throw new Error("NOT A VALID HOST");
  return host;
}

// ---------- ping ----------

// opaque = a browser (web) hides the status of a cross-site answer. We only learn that the server answered. On the phone the real status is always visible.
export type PingResult = {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  opaque: boolean;
  ms: number;
};

const onWeb = Platform.OS === "web";

export async function pingSite(input: string): Promise<PingResult> {
  const host = input.trim();
  const url = /^https?:\/\//i.test(host) ? host : `https://${host}`;
  cleanHost(url); // throws if the host is nonsense

  const start = Date.now();
  try {
    /* A browser blocks reading a cross-site answer (CORS). "no-cors" still sends the request
     and tells us it arrived, just without the status. The phone has no such rule. */
    const init: RequestInit = onWeb ? { method: "HEAD", mode: "no-cors" } : { method: "HEAD" };
    // HEAD = headers only, nothing is downloaded. A few servers refuse it, so retry with GET.
    let res = await timedFetch(url, init, 8000);
    if (res.status === 405 || res.status === 501) {
      res = await timedFetch(url, { ...init, method: "GET" }, 8000);
    }
    const opaque = res.type === "opaque";
    return {
      url,
      status: res.status,
      statusText: opaque ? "" : statusName(res.status),
      ok: opaque || res.ok,
      opaque,
      ms: Date.now() - start,
    };
  } catch (e) {
    if ((e as Error).message === "TIMED OUT") throw e;
    throw new Error("UNREACHABLE (NO CONNECTION, DNS OR TLS ERROR)");
  }
}

// ---------- port ----------

/* "no-http" is deliberately not called "closed": from an HTTP request alone we cannot tell a
closed port from an open one that speaks something else (SSH, a database, a bad certificate). */
export type PortResult = { state: "open" | "no-answer" | "no-http"; detail: string; ms: number };

/* A phone app cannot open a raw TCP connection, so this sends an HTTP request instead.
  any HTTP answer        -> open
  nothing for 5 seconds  -> no-answer (firewall drops it, or the host is down)
  fails straight away    -> no-http (refused, reset, not HTTP, or a certificate problem)
  Plain http:// needs the app to allow cleartext traffic (see app.json / README note). */
export async function checkPort(hostInput: string, portInput: string): Promise<PortResult> {
  if (onWeb) throw new Error("PORT CHECK NEEDS THE PHONE APP: A BROWSER CAN'T DO IT");
  const host = cleanHost(hostInput);
  const port = Number(portInput);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT MUST BE 1-65535");

  const scheme = port === 443 || port === 8443 ? "https" : "http";
  const start = Date.now();
  try {
    const res = await timedFetch(`${scheme}://${host}:${port}/`, { method: "HEAD" }, 5000);
    return { state: "open", detail: `HTTP ${res.status}`, ms: Date.now() - start };
  } catch (e) {
    const ms = Date.now() - start;
    if ((e as Error).message === "TIMED OUT") {
      return { state: "no-answer", detail: "NO ANSWER IN 5S", ms };
    }
    return { state: "no-http", detail: "NO HTTP ANSWER", ms };
  }
}

// ---------- ip ----------

export type IpInfo = { ip: string; place: string; isp: string; timezone: string };

// ipwho.is: free, no key. Empty input = the IP you are connecting from.
export async function lookupIp(input: string): Promise<IpInfo> {
  const target = input.trim();
  if (target && !/^[0-9a-f:.]+$/i.test(target)) throw new Error("NOT A VALID IP ADDRESS");

  const res = await timedFetch(`https://ipwho.is/${target}`, {}, 8000);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  if (!j.success) throw new Error(String(j.message ?? "LOOKUP FAILED").toUpperCase());

  return {
    ip: j.ip,
    place: [j.city, j.region, j.country].filter(Boolean).join(", "),
    isp: j.connection?.isp || j.connection?.org || "UNKNOWN",
    timezone: j.timezone?.id ?? "UNKNOWN",
  };
}

// ---------- dns ----------

const DNS_TYPES = { A: 1, AAAA: 28, CNAME: 5, MX: 15, NS: 2, TXT: 16 } as const;
export type DnsType = keyof typeof DNS_TYPES;
export const DNS_TYPE_LIST = Object.keys(DNS_TYPES) as DnsType[];

export type DnsRecord = { type: string; ttl: number; data: string };

// DNS over HTTPS by Cloudflare: free, no key, answers as JSON.
export async function lookupDns(input: string, type: DnsType): Promise<DnsRecord[]> {
  const domain = cleanHost(input);
  const res = await timedFetch(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
    { headers: { accept: "application/dns-json" } },
    8000,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  if (j.Status === 3) throw new Error("DOMAIN DOES NOT EXIST");

  const names = Object.fromEntries(Object.entries(DNS_TYPES).map(([k, v]) => [v, k]));
  return ((j.Answer ?? []) as { type: number; TTL: number; data: string }[]).map((a) => ({
    type: names[a.type] ?? String(a.type),
    ttl: a.TTL,
    data: a.data,
  }));
}

// ---------- ssl ----------

export type SslInfo = {
  issuedTo: string;
  issuedBy: string;
  validTo: string;
  daysLeft: number;
  names: string[];
};

// A phone app cannot read the certificate itself, so NetworkCalc connects to the server and reports it. Free, no key.
export async function checkSsl(input: string): Promise<SslInfo> {
  const host = cleanHost(input);
  const res = await timedFetch(
    `https://networkcalc.com/api/security/certificate/${encodeURIComponent(host)}`,
    {},
    15000,
  );
  const j = await res.json().catch(() => null);
  if (!res.ok || !j || j.status !== "OK" || !j.certificate) {
    throw new Error("COULD NOT READ A CERTIFICATE FROM THAT HOST");
  }
  const c = j.certificate;
  return {
    issuedTo: c.issued_to,
    issuedBy: c.issued_by,
    validTo: c.valid_to,
    daysLeft: Math.floor((new Date(c.valid_to).getTime() - Date.now()) / 86400000),
    names: ((c.alternate_names ?? []) as string[]).map((n) => n.replace(/^DNS:/, "")),
  };
}
