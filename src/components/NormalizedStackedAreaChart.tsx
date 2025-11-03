import * as d3 from "d3";
import { useRef, useEffect, useState, useMemo } from "react";

interface DataPoint {
  sector: string;
  metric: string;
  year: string;
  technology: keyof typeof technologyColors;
  value: number;
}

interface ChartData {
  data: DataPoint[];
}

interface NormalizedStackedAreaChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  sector?: string;
  metric?: string;
}

const technologyColors = {
  coal: "#DF4E39",
  oil: "#AB3C2C",
  gas: "#F7988B",
  other: "#B3BCC5",
  biomass: "#91CBF2",
  hydro: "#2888C9",
  wind: "#005A96",
  solar: "#003B63",
} as const;

export default function NormalizedStackedAreaChart({
  data,
  width = 600,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
  sector = "power",
  metric = "capacity",
}: NormalizedStackedAreaChartProps) {
  const [d3data, setD3data] = useState<DataPoint[]>(() =>
    data.data.filter((d) => d.sector === sector && d.metric === metric),
  );

  const ref = useRef<SVGSVGElement>(null);
  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);
  const areas = useRef<SVGGElement>(null);

  // Memoize scales and data transformations
  const chartSetup = useMemo(() => {
    const utc = d3.utcParse("%Y");
    const years = d3.extent(d3data, (d) => utc(d.year));
    const xticks = Array.from(new Set(d3data.map((d) => d.year))).map(utc);

    if (!years[0] || !years[1]) return null;

    const x = d3
      .scaleUtc()
      .domain(years)
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear().rangeRound([height - marginBottom, marginTop]);

    const sortedKeys = Array.from(
      new Set(d3data.map((d) => d.technology)),
    ).sort(
      (a, b) =>
        Object.keys(technologyColors).indexOf(a) -
        Object.keys(technologyColors).indexOf(b),
    );

    const series = d3
      .stack<Map<string, DataPoint>, string>()
      .offset(d3.stackOffsetExpand)
      .keys(sortedKeys)
      .value(([, D], key) => D.get(key)?.value ?? 0)(
      d3.index(
        d3data,
        (d) => d.year,
        (d) => d.technology,
      ),
    );

    const area = d3
      .area<d3.SeriesPoint<d3.Series<Map<string, DataPoint>, string>>>()
      .x((d) => x(utc(d.data[0]) as Date))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]));

    return { x, y, series, area, xticks, utc };
  }, [d3data, width, height, marginLeft, marginRight, marginTop, marginBottom]);

  useEffect(() => {
    if (
      !ref.current ||
      !gx.current ||
      !gy.current ||
      !areas.current ||
      !chartSetup
    )
      return;

    const { x, y, series, area, xticks } = chartSetup;
    const areasGroup = d3.select(areas.current);

    // Update X axis
    d3.select(gx.current)
      .transition()
      .duration(750)
      .call(d3.axisBottom(x).tickValues(xticks) as any)
      .style("font-size", "14px")
      .style("font-weight", "bold");

    // Update Y axis
    d3.select(gy.current)
      .transition()
      .duration(750)
      .call(d3.axisLeft(y).ticks(5, "%") as any)
      .style("font-size", "12px");

    // Update areas
    areasGroup
      .selectAll<SVGPathElement, d3.Series<Map<string, DataPoint>, string>>(
        "path",
      )
      .data(series)
      .join("path")
      .attr(
        "fill",
        (d) => technologyColors[d.key as keyof typeof technologyColors],
      )
      .attr("d", area);
  }, [d3data, chartSetup]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
    >
      <g
        ref={gx}
        transform={`translate(0, ${height - marginBottom})`}
      />
      <g
        ref={gy}
        transform={`translate(${marginLeft}, 0)`}
      />
      <g ref={areas} />
    </svg>
  );
}
