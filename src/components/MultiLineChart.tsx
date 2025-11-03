import * as d3 from "d3";
import { useRef, useEffect, useState, useMemo } from "react";

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
  marginTop = 20,
  marginRight = 80,
  marginBottom = 30,
  marginLeft = 40,
  sector = "power",
  metric = "capacity",
}: MultiLineChartProps) {
  const [d3data, setD3data] = useState<DataPoint[]>(() =>
    data.data.filter((d) => d.sector === sector && d.metric === metric),
  );

  const ref = useRef<SVGSVGElement>(null);
  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);
  const lines = useRef<SVGGElement>(null);
  const dots = useRef<SVGGElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Memoize scales and data transformations
  const chartSetup = useMemo(() => {
    const utc = d3.utcParse("%Y");
    const years = d3.extent(d3data, (d) => utc(d.year));
    const values = d3.extent(d3data, (d) => d.value);
    const xticks = Array.from(new Set(d3data.map((d) => d.year))).map(utc);

    if (!years[0] || !years[1] || !values[0] || !values[1]) {
      return null;
    }

    const x = d3
      .scaleUtc()
      .domain(years)
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain(values)
      .range([height - marginBottom, marginTop]);

    const line = d3
      .line<DataPoint>()
      .x((d) => x(utc(d.year) as Date))
      .y((d) => y(d.value));

    return { x, y, line, xticks, utc };
  }, [d3data, width, height, marginLeft, marginRight, marginTop, marginBottom]);

  useEffect(() => {
    if (
      !ref.current ||
      !gx.current ||
      !gy.current ||
      !lines.current ||
      !chartSetup
    )
      return;

    const { x, y, line, xticks, utc } = chartSetup;
    const linesGroup = d3.select(lines.current);

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
      .call(d3.axisLeft(y) as any)
      .style("font-size", "12px");

    const groupedData = d3.groups(d3data, (d) => d.technology);
    const selectedTech = selectRef.current?.value;

    // Update lines
    linesGroup
      .selectAll<SVGPathElement, GroupedData>(".line")
      .data(groupedData)
      .join("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d) =>
        d[0] === selectedTech ? "var(--color-donate)" : "var(--color-coal)",
      )
      .attr("stroke-width", (d) => (d[0] === selectedTech ? 3 : 1))
      .attr("d", (d) => line(d[1]))
      .attr("data-year", (d) => d[1][0].year)
      .attr("data-value", (d) => d[1][0].value)
      .attr("data-geography", (d) => d[1][0].geography)
      .attr("data-metric", (d) => d[1][0].metric)
      .attr("data-sector", (d) => d[1][0].sector)
      .attr("data-technology", (d) => d[1][0].technology)
      .attr("data-unit", (d) => d[1][0].unit);

    // Update labels
    linesGroup
      .selectAll<SVGTextElement, GroupedData>(".label")
      .data(groupedData)
      .join("text")
      .text((d) => d[0])
      .attr("class", "label")
      .attr("x", (d) => x(utc(d[1][d[1].length - 1].year) as Date))
      .attr("y", (d) => y(d[1][d[1].length - 1].value))
      .attr("dx", "12")
      .attr("dy", "5");
  }, [d3data, chartSetup]);

  const highlightSelectedTech = (selectedTech: string): void => {
    if (!lines.current) return;

    d3.select(lines.current)
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
    <>
      <label>
        Highlight:
        <select
          ref={selectRef}
          onChange={(e) => highlightSelectedTech(e.target.value)}
        >
          {data &&
            uniqueTechs(data).map((tech) => (
              <option
                key={tech}
                value={tech}
              >
                {tech}
              </option>
            ))}
        </select>
      </label>
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
        <g ref={lines} />
        <g ref={dots} />
      </svg>
    </>
  );
}
