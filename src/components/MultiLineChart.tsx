import { pointer, select, Selection } from "d3-selection";
import { scaleUtc, scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { utcParse } from "d3-time-format";
import { ascending, extent, groups, leastIndex, range } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { useRef, useEffect, useMemo } from "react";
import { capitalizeWords } from "../utils/capitalizeWords";

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

type LabelData = { label: string; x: number; y: number };

export default function MultiLineChart({
  data,
  width = 600,
  height = 400,
  marginTop = 40,
  marginRight = 80,
  marginBottom = 30,
  marginLeft = 50,
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
    const xticks = Array.from(new Set(d3data.map((d) => d.year)))
      .map(parse)
      .filter(
        (d, i): d is Date =>
          d !== null && (i === 0 || d.getUTCFullYear() % 10 === 0),
      );

    if (
      !years[0] ||
      !years[1] ||
      (!values[0] && values[0] !== 0) ||
      (!values[1] && values[1] !== 0)
    ) {
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

    function dodge(
      positions: number[],
      separation: number = 12,
      maxiter: number = 10,
      maxerror: number = 1e-1,
    ): number[] {
      positions = Array.from(positions);
      const n = positions.length;
      if (!positions.every(isFinite)) throw new Error("invalid position");
      if (!(n > 1)) return positions;
      const index = range(positions.length);
      for (let iter = 0; iter < maxiter; ++iter) {
        index.sort((i, j) => ascending(positions[i], positions[j]));
        let error = 0;
        for (let i = 1; i < n; ++i) {
          let delta = positions[index[i]] - positions[index[i - 1]];
          if (delta < separation) {
            delta = (separation - delta) / 2;
            error = Math.max(error, delta);
            positions[index[i - 1]] -= delta;
            positions[index[i]] += delta;
          }
        }
        if (error < maxerror) break;
      }
      return positions;
    }

    return { x, y, line: lineGenerator, xticks, parse, dodge };
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

    const { x, y, line: lineGenerator, xticks, parse, dodge } = chartSetup;

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
    const dodged = dodge(
      groupedData.map((d) => y(d[1][d[1].length - 1].value)),
    );

    const labelData = groupedData.map((d, i) => ({
      label: capitalizeWords(d[0]),
      x: x(parse(d[1][d[1].length - 1].year) as Date),
      y: dodged[i],
    }));

    (
      select(lines.current)
        .selectAll<SVGTextElement, LabelData>(".label")
        .data(labelData)
        .join("text") as UpdateSelection
    )
      .text((d) => d.label as string)
      .attr("class", "label")
      .attr("x", (d) => d.x as number)
      .attr("y", (d) => d.y as number)
      .attr("dx", "18")
      .attr("dy", "5")
      .attr("font-size", "12px");

    // Add an invisible layer for the interactive tip.
    const svg = select(ref.current);
    const path = select(lines.current).selectAll("path");

    const points = d3data.map((d) => [
      x(parse(d.year)),
      y(d.value),
      d.technology,
      d.year,
      d.value,
      d.unit,
    ]);

    const dot = svg.append("g").attr("display", "none");

    dot.append("circle").attr("r", 2.5);

    const tooltipBoxElem = dot
      .selectAll<SVGPathElement, unknown>("path")
      .data([null])
      .join("path")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round");

    const tooltipTextElem = dot
      .selectAll<SVGTextElement, unknown>("text")
      .data([null])
      .join("text");

    svg
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", (event: TouchEvent) => event.preventDefault())
      .on("click", pointerclick);

    function pointermoved(event: PointerEvent) {
      const [xm, ym] = pointer(event);
      const i = leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
      if (i === undefined || i < 0) return;
      const [x, y, k, year, value, unit] = points[i];

      path
        .attr("stroke", (d) => (d[0] === k ? "var(--color-donate)" : "#ddd"))
        .attr("stroke-width", (d) => (d[0] === k ? 3 : 1))
        .filter((d) => d[0] === k)
        .raise();

      dot.attr("transform", `translate(${x},${y})`);

      const tooltipText = [
        capitalizeWords(k as string) + ": " + year,
        value + " " + unit,
      ];

      tooltipTextElem.call((text) =>
        text
          .selectAll("tspan")
          .data(tooltipText)
          .join("tspan")
          .attr("x", 0)
          .attr("y", (_, i) => `${i * 1.1}em`)
          .attr("font-size", "12px")
          .attr("font-weight", (_, i) => (i ? null : "bold"))
          .text((d) => d),
      );

      size(tooltipTextElem, tooltipBoxElem);
    }

    function pointerentered() {
      path.style("mix-blend-mode", null).attr("stroke", "#ddd");
      dot.attr("display", null);
    }

    function pointerleft() {
      const selectedTech = selectRef.current?.value;
      path
        .style("mix-blend-mode", "multiply")
        .attr("stroke", (d: GroupedData) =>
          d[0] === selectedTech ? "var(--color-donate)" : "var(--color-coal)",
        )
        .attr("stroke-width", (d: GroupedData) => (d[0] === selectedTech ? 3 : 1));
      dot.attr("display", "none");
    }

    svg.on("touchstart", (event: TouchEvent) => event.preventDefault());

    function pointerclick(event: PointerEvent) {
      const [xm, ym] = pointer(event);
      const i = leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
      if (i === undefined || i < 0) return;
      const selectedTech = points[i][2];
      console.log("clicked on: ", selectedTech);
    }

    function size(
      text: Selection<SVGTextElement, unknown, null, undefined>,
      path: Selection<SVGPathElement, unknown, null, undefined>
    ) {
      const bbox = text.node()?.getBBox();
      if (!bbox) return;
      const { y, width: w, height: h } = bbox;
      text.attr("transform", `translate(${-w / 2},${15 - y})`);
      path.attr(
        "d",
        `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`,
      );
    }
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
