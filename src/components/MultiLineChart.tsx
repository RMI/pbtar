import { select, Selection } from "d3-selection";
import { scaleUtc, scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { utcParse } from "d3-time-format";
import { groups } from "d3-array";
import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { useRef, useEffect, useMemo } from "react";
import { capitalizeWords } from '../utils/capitalizeWords';

interface DataPoint {
  sector: string;
  metric: string;
  year: string;
  technology: string;
  value: number;
  geography: string;
  unit: string;
}

interface ChartData {
  data: DataPoint[];
}

interface MultiLineChartProps {
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

type GroupedData = [string, DataPoint[]];

export default function MultiLineChart({
  data,
  width = 600,
  height = 400,
  marginTop = 40,
  marginRight = 80,
  marginBottom = 30,
  marginLeft = 40,
  sector = "power",
  metric = "capacity",
}: MultiLineChartProps) {
  const d3data = useMemo(
    () => data.data.filter((d) => d.sector === sector && d.metric === metric),
    [data.data, sector, metric],
  );

  const ref = useRef<SVGSVGElement>(null);
  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);
  const lines = useRef<SVGGElement>(null);
  const dots = useRef<SVGGElement>(null);
  const title = useRef<SVGGElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Memoize scales and data transformations
  const chartSetup = useMemo(() => {
    const parse = utcParse("%Y");
    const years = extent(d3data, (d) => parse(d.year));
    const values = extent(d3data, (d) => d.value);
    const xticks = Array.from(new Set(d3data.map((d) => d.year))).map(parse);

    if (!years[0] || !years[1] || !values[0] || !values[1]) {
      return null;
    }

    const x = scaleUtc()
      .domain(years)
      .range([marginLeft, width - marginRight]);

    const y = scaleLinear()
      .domain(values)
      .range([height - marginBottom, marginTop]);

    const lineGenerator = line<DataPoint>()
      .x((d) => x(parse(d.year) as Date))
      .y((d) => y(d.value));

    return { x, y, line: lineGenerator, xticks, parse };
  }, [d3data, width, height, marginLeft, marginRight, marginTop, marginBottom]);

  useEffect(() => {
    if (
      !ref.current ||
      !gx.current ||
      !gy.current ||
      !lines.current ||
      !title.current ||
      !chartSetup
    )
      return;

    const { x, y, line: lineGenerator, xticks } = chartSetup;

    type UpdateSelection = Selection<
      SVGPathElement | SVGTextElement,
      GroupedData,
      SVGGElement,
      unknown
    >;

    // Update title
    const unit = d3data[0]?.unit || "";
    select(title.current)
      .selectAll("text")
      .data([`${capitalizeWords(sector)} ${capitalizeWords(metric)} [${unit}]`])
      .join("text")
      .attr("x", width / 2)
      .attr("y", marginTop - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text((d) => d);

    // Update X axis
    select(gx.current)
      .transition()
      .duration(750)
      .call(axisBottom(x).tickValues(xticks))
      .style("font-size", "14px");

    // Update Y axis
    select(gy.current)
      .transition()
      .duration(750)
      .call(axisLeft(y))
      .style("font-size", "12px");

    const groupedData = groups(d3data, (d) => d.technology);
    const selectedTech = selectRef.current?.value;

    // Update lines
    (
      select(lines.current)
        .selectAll<SVGPathElement, GroupedData>(".line")
        .data(groupedData)
        .join("path") as UpdateSelection
    )
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d) =>
        d[0] === selectedTech ? "var(--color-donate)" : "var(--color-coal)",
      )
      .attr("stroke-width", (d) => (d[0] === selectedTech ? 3 : 1))
      .attr("d", (d) => lineGenerator(d[1]) || "")
      .attr("data-year", (d) => d[1][0].year)
      .attr("data-value", (d) => d[1][0].value)
      .attr("data-geography", (d) => d[1][0].geography)
      .attr("data-metric", (d) => d[1][0].metric)
      .attr("data-sector", (d) => d[1][0].sector)
      .attr("data-technology", (d) => d[1][0].technology)
      .attr("data-unit", (d) => d[1][0].unit);

    // Update labels with capitalized technology names
    (
      select(lines.current)
        .selectAll<SVGTextElement, GroupedData>(".label")
        .data(groupedData)
        .join("text") as UpdateSelection
    )
      .text((d) => capitalizeWords(d[0]))
      .attr("class", "label")
      .attr("x", (d) => x(chartSetup.parse(d[1][d[1].length - 1].year) as Date))
      .attr("y", (d) => y(d[1][d[1].length - 1].value))
      .attr("dx", "12")
      .attr("dy", "5")
      .attr("font-size", "12px");
  }, [d3data, chartSetup, sector, metric, marginTop, width]);

  const highlightSelectedTech = (selectedTech: string): void => {
    if (!lines.current) return;

    select(lines.current)
      .selectAll<SVGPathElement, GroupedData>(".line")
      .attr("stroke", (d) =>
        d[0] === selectedTech ? "var(--color-donate)" : "var(--color-coal)",
      )
      .attr("stroke-width", (d) => (d[0] === selectedTech ? 3 : 1));
  };

  const uniqueTechs = (data: ChartData): string[] => {
    return Array.from(
      new Set(
        data.data
          .map((a) => a.technology)
          .filter((n): n is string => n !== null && n !== undefined),
      ),
    );
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={ref}
        width={width}
        height={height}
      >
        <g ref={title} />
        <g
          ref={gx}
          transform={`translate(0, ${height - marginBottom})`}
        />
        <g
          ref={gy}
          transform={`translate(${marginLeft}, 0)`}
        />
        <g ref={lines} />
        <g ref={dots} />
      </svg>
      <div className="mt-4">
        <label className="mr-2">
          Highlight:
          <select
            ref={selectRef}
            onChange={(e) => highlightSelectedTech(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            {data &&
              uniqueTechs(data).map((tech) => (
                <option
                  key={tech}
                  value={tech}
                >
                  {capitalizeWords(tech)}
                </option>
              ))}
          </select>
        </label>
      </div>
    </div>
  );
}
