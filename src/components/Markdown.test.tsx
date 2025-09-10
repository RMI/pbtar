import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Markdown from "./Markdown";

describe("Markdown external link behavior", () => {
  it("adds target/rel only to http/https links (explicit https)", () => {
    render(<Markdown>[link](https://example.com)</Markdown>);
    const link = screen.getByRole("link", { name: "link" });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("https://example.com");
    expect(link.getAttribute("target")).toBe("_blank");
    const rel = (link.getAttribute("rel") ?? "").split(" ").sort();
    expect(rel).toEqual(["noopener", "noreferrer"].sort());
  });

  it("adds target/rel only to http/https links (explicit http)", () => {
    render(<Markdown>[link](http://example.com)</Markdown>);
    const link = screen.getByRole("link", { name: "link" });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("http://example.com");
    expect(link.getAttribute("target")).toBe("_blank");
    const rel = (link.getAttribute("rel") ?? "").split(" ").sort();
    expect(rel).toEqual(["noopener", "noreferrer"].sort());
  });

  it("does not touch site-internal hash anchors", () => {
    render(<Markdown>[jump](#section)</Markdown>);
    const a = screen.getByRole("link", { name: "jump" });
    // unchanged target/rel
    expect(a.target).toBe("");
    expect(a.rel).toBe("");
    expect(a.getAttribute("href")).toBe("#section");
  });

  it("does not force target on relative paths", () => {
    render(<Markdown>[Home](/)</Markdown>);
    const a = screen.getByRole("link", { name: "Home" });
    expect(a.target).toBe("");
    expect(a.rel).toBe("");
  });

  it("does not modify non-http schemes like mailto:", () => {
    render(<Markdown>[Email](mailto:test@example.org)</Markdown>);
    const a = screen.getByRole("link", { name: "Email" });
    expect(a.target).toBe("");
    expect(a.rel).toBe("");
    expect(a.href).toBe("mailto:test@example.org");
  });

  it("handles multiple links and only modifies the externals", () => {
    render(
      <Markdown>
        {`[ext](http://example.com) [int](/docs) [hash](#id) [ext2](https://rmi.org)`}
      </Markdown>,
    );
    const links = screen.getAllByRole("link");
    const [ext, int, hash, ext2] = links;
    expect(ext.target).toBe("_blank");
    expect(ext2.target).toBe("_blank");
    expect(int.target).toBe("");
    expect(hash.target).toBe("");
  });

  it("preserves link titles and still adds target/rel", () => {
    render(<Markdown>[titled](https://example.com "Example Title")</Markdown>);
    const a = screen.getByRole("link", { name: "titled" });
    expect(a.title).toBe("Example Title");
    expect(a.target).toBe("_blank");
    expect(a.rel).toContain("noopener");
    expect(a.rel).toContain("noreferrer");
  });
});

describe("Markdown safety/other elements", () => {
  it("does not alter images; only anchors receive target/rel", () => {
    render(<Markdown>![alt text](/img/logo.png)</Markdown>);
    const img = screen.getByRole("img", {
      name: "alt text",
    });
    expect(img.src).toMatch(/\/img\/logo\.png$/);
  });

  it("works when a link wraps an image; the anchor should get target/rel", () => {
    render(
      <Markdown>{`[![alt](/img/logo.png)](https://example.com)`}</Markdown>,
    );
    const link = screen.getByRole("link");
    expect(link.target).toBe("_blank");
    expect(link.rel).toContain("noopener");
    expect(link.rel).toContain("noreferrer");
    const img = within(link).getByRole("img", { name: "alt" });
    expect(img).toBeInTheDocument();
  });
});
