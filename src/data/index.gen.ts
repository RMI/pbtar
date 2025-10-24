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
  schema: { version: number; generatedAt: string };
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
        path: "/data/asean-centre-for-energy/BAS-2024_timeseries.json",
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
      path: "/data/asean-centre-for-energy/BAS-2024_timeseries.json",
    },
  },
  schema: {
    version: 1,
    generatedAt: "2025-10-24T08:58:01.398Z",
  },
} as const;
export default index;
