import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";

type Props = { children: string };

// Centralizes our markdown behavior (target, rel, future plugins).
export default function Markdown({ children }: Props) {
  return (
    <ReactMarkdown
      // Only external links get target/rel; internal anchors remain untouched.
      rehypePlugins={[[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]]}
    >
      {children}
    </ReactMarkdown>
  );
}
