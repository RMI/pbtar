import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";

type Props = { children: string | string[] };

// Centralizes our markdown behavior (target, rel, future plugins).
export default function Markdown({ children }: Props) {
  const normalized = Array.isArray(children)
    ? normalizeMarkdownLines(children)
    : children;

  return (
    <ReactMarkdown
      // Only external links get target/rel; internal anchors remain untouched.
      rehypePlugins={[
        [
          rehypeExternalLinks,
          { target: "_blank", rel: ["noopener", "noreferrer"] },
        ],
      ]}
    >
      {normalized}
    </ReactMarkdown>
  );
}

/**
 * - Collapses consecutive blank lines: ["A", "", "", "B"] → ["A", "", "B"]
 * - Ensures exactly one blank line after ATX headers ("# ..", "## ..", ...).
 * - Joins with "\n" for markdown parsing.
 */
function normalizeMarkdownLines(lines: string[]): string {
  const out: string[] = [];
  const isBlank = (s: string) => s === "";
  for (let i = 0; i < lines.length; i++) {
    const curr = lines[i];
    const prev = out[out.length - 1];
    // collapse multiple blanks
    if (isBlank(curr) && isBlank(prev ?? "")) continue;
    out.push(curr);
    // ensure one blank after headers (ATX)
    if (/^#{1,6}\s+.+$/.test(curr)) {
      const next = lines[i + 1];
      if (next !== "" && next !== undefined) {
        out.push(""); // inject a single blank line after a header if missing
      }
    }
  }
  return out.join("\n");
}
