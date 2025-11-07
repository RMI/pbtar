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
  },
} as const;
export default index;
