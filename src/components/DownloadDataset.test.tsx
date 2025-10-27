// @vitest-environment jsdom
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DownloadDataset from "./DownloadDataset";

describe("<DownloadDataset />", () => {
  it("renders label and a download link with href", () => {
    render(
      <DownloadDataset
        label="BAS Timeseries"
        href="/data/BAS-2024_timeseries.json"
      />,
    );
    expect(screen.getByText("BAS Timeseries")).toBeInTheDocument();
    const link = screen.getByText("Download");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/data/BAS-2024_timeseries.json");
    expect(link.getAttribute("download")).not.toBeNull();
  });

  it("shows summary when provided", () => {
    render(
      <DownloadDataset
        label="Dataset"
        href="/data/ds.json"
        summary="1990 → 2050 · 5 sectors · 3 geographies · 1620 rows"
      />,
    );
    expect(screen.getByText(/1990/)).toBeInTheDocument();
  });
});
