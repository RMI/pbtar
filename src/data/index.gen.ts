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
    "IEA-APS-2024": [
      {
        datasetId: "IEA-APS-2024_TS",
        label: "Announced Pledges Scenario (APS) Timeseries Data",
        summary: {
          rowCount: 287,
          yearRange: [2010, 2050],
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
          rowCount: 245,
          yearRange: [2010, 2050],
          sectorCount: 1,
          geographyCount: 2,
        },
        path: "/data/iea/IEA-NZE-2024_TS.csv",
      },
    ],
    "IEA-STEPS-2024": [
      {
        datasetId: "IEA-STEPS-2024_TS",
        label: "Stated Policies Scenario (STEPS) Timeseries Data",
        summary: {
          rowCount: 301,
          yearRange: [2010, 2050],
          sectorCount: 1,
          geographyCount: 2,
        },
        path: "/data/iea/IEA-STEPS-2024_TS.csv",
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
    "IEA-APS-2024_TS": {
      datasetId: "IEA-APS-2024_TS",
      pathwayIds: ["IEA-APS-2024"],
      label: "Announced Pledges Scenario (APS) Timeseries Data",
      summary: {
        rowCount: 287,
        yearRange: [2010, 2050],
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
        rowCount: 245,
        yearRange: [2010, 2050],
        sectorCount: 1,
        geographyCount: 2,
      },
      path: "/data/iea/IEA-NZE-2024_TS.csv",
    },
    "IEA-STEPS-2024_TS": {
      datasetId: "IEA-STEPS-2024_TS",
      pathwayIds: ["IEA-STEPS-2024"],
      label: "Stated Policies Scenario (STEPS) Timeseries Data",
      summary: {
        rowCount: 301,
        yearRange: [2010, 2050],
        sectorCount: 1,
        geographyCount: 2,
      },
      path: "/data/iea/IEA-STEPS-2024_TS.csv",
    },
  },
} as const;
export default index;
