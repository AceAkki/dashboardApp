import { Colors } from "@/constants/Colors";

export type StatusCode = { code: number; name: string; text: string };

export const STATUS_CODES: StatusCode[] = [
  { code: 100, name: "Continue", text: "Headers received, go ahead and send the body." },
  { code: 101, name: "Switching Protocols", text: "Server agrees to switch protocol, e.g. to WebSocket." },
  { code: 102, name: "Processing", text: "Server is still working on the request (WebDAV)." },
  { code: 103, name: "Early Hints", text: "Preload hints sent before the final response." },

  { code: 200, name: "OK", text: "Request succeeded." },
  { code: 201, name: "Created", text: "A new resource was created. Typical answer to POST." },
  { code: 202, name: "Accepted", text: "Received, but the work happens later." },
  { code: 203, name: "Non-Authoritative Information", text: "Success, but a proxy changed the response." },
  { code: 204, name: "No Content", text: "Success with an empty body. Typical for DELETE." },
  { code: 205, name: "Reset Content", text: "Success, the client should reset its form or view." },
  { code: 206, name: "Partial Content", text: "Only the requested byte range was sent." },

  { code: 300, name: "Multiple Choices", text: "Several possible resources, the client must pick one." },
  { code: 301, name: "Moved Permanently", text: "Resource has a new URL for good. Update your links." },
  { code: 302, name: "Found", text: "Temporary redirect. Keep using the old URL." },
  { code: 303, name: "See Other", text: "Go fetch the result with a GET at another URL." },
  { code: 304, name: "Not Modified", text: "Your cached copy is still good." },
  { code: 307, name: "Temporary Redirect", text: "Like 302 but the method and body must stay the same." },
  { code: 308, name: "Permanent Redirect", text: "Like 301 but the method and body must stay the same." },

  { code: 400, name: "Bad Request", text: "The request is malformed: bad JSON, missing field." },
  { code: 401, name: "Unauthorized", text: "Not logged in, or the token is missing or expired." },
  { code: 402, name: "Payment Required", text: "Reserved for payment flows. Rarely used." },
  { code: 403, name: "Forbidden", text: "Logged in, but not allowed to do this." },
  { code: 404, name: "Not Found", text: "Nothing at this URL (or the server hides it)." },
  { code: 405, name: "Method Not Allowed", text: "Wrong verb, e.g. GET on a POST-only endpoint." },
  { code: 406, name: "Not Acceptable", text: "Server can't produce what the Accept header asks for." },
  { code: 408, name: "Request Timeout", text: "The client took too long to send the request." },
  { code: 409, name: "Conflict", text: "Clashes with current state: duplicate, version mismatch." },
  { code: 410, name: "Gone", text: "Was here, permanently removed." },
  { code: 411, name: "Length Required", text: "Content-Length header is required." },
  { code: 412, name: "Precondition Failed", text: "An If-Match style condition was false." },
  { code: 413, name: "Payload Too Large", text: "Body is bigger than the server accepts." },
  { code: 414, name: "URI Too Long", text: "The URL is too long." },
  { code: 415, name: "Unsupported Media Type", text: "Wrong Content-Type, e.g. sent text, API wants JSON." },
  { code: 416, name: "Range Not Satisfiable", text: "Requested byte range is outside the file." },
  { code: 418, name: "I'm a teapot", text: "April Fools joke from 1998. Some APIs use it to block bots." },
  { code: 422, name: "Unprocessable Content", text: "Well-formed, but the values fail validation." },
  { code: 423, name: "Locked", text: "The resource is locked (WebDAV)." },
  { code: 425, name: "Too Early", text: "Server won't risk replaying an early request." },
  { code: 426, name: "Upgrade Required", text: "Switch to a newer protocol and try again." },
  { code: 428, name: "Precondition Required", text: "Request must be conditional to avoid overwrites." },
  { code: 429, name: "Too Many Requests", text: "Rate limited. Check the Retry-After header." },
  { code: 431, name: "Header Fields Too Large", text: "Headers (often cookies) are too big." },
  { code: 451, name: "Unavailable For Legal Reasons", text: "Blocked by law or court order." },

  { code: 500, name: "Internal Server Error", text: "The server crashed on this request. Check its logs." },
  { code: 501, name: "Not Implemented", text: "Server doesn't support this method at all." },
  { code: 502, name: "Bad Gateway", text: "A proxy got an invalid answer from the server behind it." },
  { code: 503, name: "Service Unavailable", text: "Overloaded or down for maintenance." },
  { code: 504, name: "Gateway Timeout", text: "A proxy gave up waiting for the server behind it." },
  { code: 505, name: "HTTP Version Not Supported", text: "Server doesn't speak this HTTP version." },
  { code: 507, name: "Insufficient Storage", text: "Server is out of space (WebDAV)." },
  { code: 508, name: "Loop Detected", text: "The server found an infinite loop (WebDAV)." },
  { code: 511, name: "Network Authentication Required", text: "Log in to the network first, e.g. hotel wifi." },
];

export const STATUS_CLASSES = [
  { key: "1xx", label: "INFO", color: Colors.info },
  { key: "2xx", label: "SUCCESS", color: Colors.success },
  { key: "3xx", label: "REDIRECT", color: Colors.warning },
  { key: "4xx", label: "CLIENT ERROR", color: Colors.danger },
  { key: "5xx", label: "SERVER ERROR", color: Colors.tertiary },
] as const;

export const classOf = (code: number) => STATUS_CLASSES[Math.floor(code / 100) - 1];

// "OK", "Not Found" ... or "" for a code that is not in the list
export const statusName = (code: number) =>
  STATUS_CODES.find((s) => s.code === code)?.name ?? "";

// matches the number ("40", "404"), the name or the explanation
export function searchStatus(query: string, classKey: string | null): StatusCode[] {
  const q = query.trim().toLowerCase();
  return STATUS_CODES.filter(
    (s) =>
      (!classKey || classOf(s.code).key === classKey) &&
      (!q ||
        String(s.code).startsWith(q) ||
        s.name.toLowerCase().includes(q) ||
        s.text.toLowerCase().includes(q)),
  );
}
