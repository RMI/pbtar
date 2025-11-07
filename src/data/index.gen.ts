/* AUTO-GENERATED FILE. DO NOT EDIT.
   Created by scripts/build-timeseries-index.ts */
export type TimeseriesIndexItem = {
  datasetId: string;
  label?: string;
  path: string;
  summary?: unknown;
};
export type TimeseriesIndex = {
  byPathway: Record<string, TimeseriesIndexItem[]>;
  byDataset: Record<
    string,
    {
      datasetId: string;
      pathwayIds: string[];
      label?: string;
      path: string;
      summary?: unknown;
    }
  >;
};
export const index: TimeseriesIndex = {
  byPathway: {
    "ACE-BAS-2024": [
      {
        datasetId: "ACE-BAS-2024_TS",
        label: "Baseline Scenario (BAS) Timeseries Data",
        summary: {
          rowCount: 182,
          yearRange: [2022, 2050],
          sectorCount: 1,
          geographyCount: 1,
        },
        path: "/data/asean-centre-for-energy/BAS-2024_timeseries.csv",
      },
    ],
    "JRC-GECO-1.5C-2025": [
      {
        datasetId: "JRC-GECO-1.5C-2025_TS",
        label: "1.5°C scenario (1.5°C) Timeseries Data",
        summary: {
          rowCount: 1566,
          yearRange: [2020, 2070],
          sectorCount: 1,
          geographyCount: 6,
        },
        path: "/data/jrc/jrc-geco_1_5-2025_timeseries.csv",
      },
    ],
    "JRC-GECO-NDC-LTS-2025": [
      {
        datasetId: "JRC-GECO-NDC-LTS-2025_TS",
        label:
          "Nationally Determined Contributions and Long-Term Strategies (NDC-LTS) Timeseries Data",
        summary: {
          rowCount: 1566,
          yearRange: [2020, 2070],
          sectorCount: 1,
          geographyCount: 6,
        },
        path: "/data/jrc/jrc-geco_ndc_lts-2025_timeseries.csv",
      },
    ],
    "JRC-GECO-Reference-2025": [
      {
        datasetId: "JRC-GECO-Reference-2025",
        label: "Reference Scenario (Reference) Timeseries Data",
        summary: {
          rowCount: 1566,
          yearRange: [2020, 2070],
          sectorCount: 1,
          geographyCount: 6,
        },
        path: "/data/jrc/jrc-geco_reference-2025_timeseries.csv",
      },
    ],
  },
  byDataset: {
    "ACE-BAS-2024_TS": {
      datasetId: "ACE-BAS-2024_TS",
      pathwayIds: ["ACE-BAS-2024"],
      label: "Baseline Scenario (BAS) Timeseries Data",
      summary: {
        rowCount: 182,
        yearRange: [2022, 2050],
        sectorCount: 1,
        geographyCount: 1,
      },
      path: "/data/asean-centre-for-energy/BAS-2024_timeseries.csv",
    },
    "JRC-GECO-1.5C-2025_TS": {
      datasetId: "JRC-GECO-1.5C-2025_TS",
      pathwayIds: ["JRC-GECO-1.5C-2025"],
      label: "1.5°C scenario (1.5°C) Timeseries Data",
      summary: {
        rowCount: 1566,
        yearRange: [2020, 2070],
        sectorCount: 1,
        geographyCount: 6,
      },
      path: "/data/jrc/jrc-geco_1_5-2025_timeseries.csv",
    },
    "JRC-GECO-NDC-LTS-2025_TS": {
      datasetId: "JRC-GECO-NDC-LTS-2025_TS",
      pathwayIds: ["JRC-GECO-NDC-LTS-2025"],
      label:
        "Nationally Determined Contributions and Long-Term Strategies (NDC-LTS) Timeseries Data",
      summary: {
        rowCount: 1566,
        yearRange: [2020, 2070],
        sectorCount: 1,
        geographyCount: 6,
      },
      path: "/data/jrc/jrc-geco_ndc_lts-2025_timeseries.csv",
    },
    "JRC-GECO-Reference-2025": {
      datasetId: "JRC-GECO-Reference-2025",
      pathwayIds: ["JRC-GECO-Reference-2025"],
      label: "Reference Scenario (Reference) Timeseries Data",
      summary: {
        rowCount: 1566,
        yearRange: [2020, 2070],
        sectorCount: 1,
        geographyCount: 6,
      },
      path: "/data/jrc/jrc-geco_reference-2025_timeseries.csv",
    },
  },
} as const;
export default index;
