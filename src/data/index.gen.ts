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
    "ACE-ATS-2024": [
      {
        datasetId: "ACE-ATS-2024_TS",
        label: "ASEAN Member State Targets Scenario (ATS) Timeseries Data",
        summary: {
          rowCount: 203,
          yearRange: [2022, 2050],
          sectorCount: 1,
          geographyCount: 1,
        },
        path: "/data/asean-centre-for-energy/ATS-2024_timeseries.csv",
      },
    ],
    "ACE-BAS-2024": [
      {
        datasetId: "ACE-BAS-2024_TS",
        label: "Baseline Scenario (BAS) Timeseries Data",
        summary: {
          rowCount: 203,
          yearRange: [2022, 2050],
          sectorCount: 1,
          geographyCount: 1,
        },
        path: "/data/asean-centre-for-energy/BAS-2024_timeseries.csv",
      },
    ],
    "ACE-CNS-2024": [
      {
        datasetId: "ACE-CNS-2024_TS",
        label: "Carbon Neutrality Scenario (CNS) Timeseries Data",
        summary: {
          rowCount: 203,
          yearRange: [2022, 2050],
          sectorCount: 1,
          geographyCount: 1,
        },
        path: "/data/asean-centre-for-energy/CNS-2024_timeseries.csv",
      },
    ],
    "ACE-RAS-2024": [
      {
        datasetId: "ACE-RAS-2024_TS",
        label: "Regional Aspiration Scenario (RAS) Timeseries Data",
        summary: {
          rowCount: 203,
          yearRange: [2022, 2050],
          sectorCount: 1,
          geographyCount: 1,
        },
        path: "/data/asean-centre-for-energy/RAS-2024_timeseries.csv",
      },
    ],
    "IEA-APS-2024": [
      {
        datasetId: "IEA-APS-2024_TS",
        label: "Announced Pledges Scenario (APS) Timeseries Data",
        summary: {
          rowCount: 242,
          yearRange: [2022, 2050],
          sectorCount: 1,
          geographyCount: 2,
        },
        path: "/data/iea/IEA-APS-2024_TS.csv",
      },
    ],
    "IEA-NZE-2024": [
      {
        datasetId: "IEA-NZE-2024_TS",
        label: "Net Zero Emissions by 2050 Scenario (NZE) Timeseries Data",
        summary: {
          rowCount: 186,
          yearRange: [2022, 2050],
          sectorCount: 1,
          geographyCount: 1,
        },
        path: "/data/iea/IEA-NZE-2024_TS.csv",
      },
    ],
    "IEA-STEPS-2024": [
      {
        datasetId: "IEA-STEPS-2024_TS",
        label: "Stated Policies Scenario (STEPS) Timeseries Data",
        summary: {
          rowCount: 256,
          yearRange: [2022, 2050],
          sectorCount: 1,
          geographyCount: 2,
        },
        path: "/data/iea/IEA-STEPS-2024_TS.csv",
      },
    ],
    "JRC-GECO-1.5C-2025": [
      {
        datasetId: "JRC-GECO-1.5C-2025_TS",
        label: "1.5C scenario (1.5C) Timeseries Data",
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
    "ACE-ATS-2024_TS": {
      datasetId: "ACE-ATS-2024_TS",
      pathwayIds: ["ACE-ATS-2024"],
      label: "ASEAN Member State Targets Scenario (ATS) Timeseries Data",
      summary: {
        rowCount: 203,
        yearRange: [2022, 2050],
        sectorCount: 1,
        geographyCount: 1,
      },
      path: "/data/asean-centre-for-energy/ATS-2024_timeseries.csv",
    },
    "ACE-BAS-2024_TS": {
      datasetId: "ACE-BAS-2024_TS",
      pathwayIds: ["ACE-BAS-2024"],
      label: "Baseline Scenario (BAS) Timeseries Data",
      summary: {
        rowCount: 203,
        yearRange: [2022, 2050],
        sectorCount: 1,
        geographyCount: 1,
      },
      path: "/data/asean-centre-for-energy/BAS-2024_timeseries.csv",
    },
    "ACE-CNS-2024_TS": {
      datasetId: "ACE-CNS-2024_TS",
      pathwayIds: ["ACE-CNS-2024"],
      label: "Carbon Neutrality Scenario (CNS) Timeseries Data",
      summary: {
        rowCount: 203,
        yearRange: [2022, 2050],
        sectorCount: 1,
        geographyCount: 1,
      },
      path: "/data/asean-centre-for-energy/CNS-2024_timeseries.csv",
    },
    "ACE-RAS-2024_TS": {
      datasetId: "ACE-RAS-2024_TS",
      pathwayIds: ["ACE-RAS-2024"],
      label: "Regional Aspiration Scenario (RAS) Timeseries Data",
      summary: {
        rowCount: 203,
        yearRange: [2022, 2050],
        sectorCount: 1,
        geographyCount: 1,
      },
      path: "/data/asean-centre-for-energy/RAS-2024_timeseries.csv",
    },
    "IEA-APS-2024_TS": {
      datasetId: "IEA-APS-2024_TS",
      pathwayIds: ["IEA-APS-2024"],
      label: "Announced Pledges Scenario (APS) Timeseries Data",
      summary: {
        rowCount: 242,
        yearRange: [2022, 2050],
        sectorCount: 1,
        geographyCount: 2,
      },
      path: "/data/iea/IEA-APS-2024_TS.csv",
    },
    "IEA-NZE-2024_TS": {
      datasetId: "IEA-NZE-2024_TS",
      pathwayIds: ["IEA-NZE-2024"],
      label: "Net Zero Emissions by 2050 Scenario (NZE) Timeseries Data",
      summary: {
        rowCount: 186,
        yearRange: [2022, 2050],
        sectorCount: 1,
        geographyCount: 1,
      },
      path: "/data/iea/IEA-NZE-2024_TS.csv",
    },
    "IEA-STEPS-2024_TS": {
      datasetId: "IEA-STEPS-2024_TS",
      pathwayIds: ["IEA-STEPS-2024"],
      label: "Stated Policies Scenario (STEPS) Timeseries Data",
      summary: {
        rowCount: 256,
        yearRange: [2022, 2050],
        sectorCount: 1,
        geographyCount: 2,
      },
      path: "/data/iea/IEA-STEPS-2024_TS.csv",
    },
    "JRC-GECO-1.5C-2025_TS": {
      datasetId: "JRC-GECO-1.5C-2025_TS",
      pathwayIds: ["JRC-GECO-1.5C-2025"],
      label: "1.5C scenario (1.5C) Timeseries Data",
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
