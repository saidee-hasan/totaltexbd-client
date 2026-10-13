// Minimal, dependency-free HTML sanitizer used before rendering admin-authored
// rich text with dangerouslySetInnerHTML. It removes the highest-risk vectors
// (script/style/iframe blocks, inline event handlers, and javascript: URLs).
// It is defence-in-depth, not a full HTML parser.
const BLOCKED_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "link",
  "meta",
  "base",
  "svg",
  "math",
  "template",
];

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return "";
  let out = String(html);

  // Drop blocked elements entirely (with their contents where paired).
  for (const tag of BLOCKED_TAGS) {
    out = out.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"),
      ""
    );
    out = out.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
  }

  // Strip inline event handlers (onclick, onerror, onload, ...).
  out = out.replace(/\son\w+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son\w+\s*=\s*'[^']*'/gi, "");
  out = out.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");

  // Neutralise javascript: / vbscript: URLs in href/src attributes.
  out = out.replace(
    /(href|src)\s*=\s*("|')\s*(?:javascript|vbscript):[^"']*\2/gi,
    '$1="#"'
  );
  out = out.replace(
    /(href|src)\s*=\s*(?:javascript|vbscript):[^\s>]*/gi,
    '$1="#"'
  );

  return out;
}
