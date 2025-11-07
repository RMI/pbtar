import { select } from "d3-selection";
import { scaleBand, scaleLinear, ScaleBand, ScaleLinear } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import "d3-transition";
import { useRef, useEffect, useMemo } from "react";
import { capitalizeWords } from "../utils/capitalizeWords";

interface DataPoint {
  sector: string;
  metric: string;
  year: string;
  value: number;
  unit: string;
}

interface ChartData {
  data: DataPoint[];
}

interface VerticalBarChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  sector?: string;
  metric?: string;
  barColor?: string;
}

interface ChartScales {
  x: ScaleBand<string>;
  y: ScaleLinear<number, number>;
  unit: string;
}

export default function VerticalBarChart({
  data,
  width = 640,
  height = 400,
  marginTop = 45,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
  sector = "power",
  metric = "emissionsIntensity",
  barColor = "midnightblue",
}: VerticalBarChartProps) {
  const d3data = useMemo(
    () => data.data.filter((d) => d.sector === sector && d.metric === metric),
    [data.data, sector, metric],
  );

  const ref = useRef<SVGSVGElement>(null);
  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);
  const bars = useRef<SVGGElement>(null);
  const title = useRef<SVGGElement>(null);

  const chartSetup = useMemo<ChartScales>(() => {
    const unit = d3data[0]?.unit ?? "";

    const x = scaleBand()
      .domain(d3data.map((d) => d.year).sort())
      .range([marginLeft, width - marginRight])
      .padding(0.6);

    const y = scaleLinear()
      .domain([0, max(d3data, (d) => d.value) ?? 0])
      .range([height - marginBottom, marginTop]);

    return { x, y, unit };
  }, [d3data, width, height, marginLeft, marginRight, marginTop, marginBottom]);

  useEffect(() => {
    if (
      !ref.current ||
      !gx.current ||
      !gy.current ||
      !bars.current ||
      !title.current ||
      !chartSetup
    )
      return;

    const { x, y, unit } = chartSetup;

    // Update title
    select(title.current)
      .selectAll("text")
      .data([`${capitalizeWords(sector)} ${capitalizeWords(metric)} [${unit}]`])
      .join("text")
      .attr("x", width / 2)
      .attr("y", marginTop - 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text((d) => d);

    // Update X axis
    select(gx.current)
      .transition()
      .duration(750)
      .call(axisBottom(x).tickSize(0))
      .style("font-size", "14px");

    // Update Y axis
    select(gy.current)
      .transition()
      .duration(750)
      .call(axisLeft(y).tickSize(0))
      .style("font-size", "12px");

    select(gy.current).select(".domain").remove();

    select(gy.current)
      .selectAll(".tick line")
      .clone()
      .attr("x2", width)
      .attr("stroke-opacity", "0.1");

    // Update bars
    select(bars.current)
      .attr("fill", barColor)
      .selectAll<SVGRectElement, DataPoint>("rect")
      .data(d3data)
      .join("rect")
      .attr("x", (d) => x(d.year) ?? 0)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value))
      .attr("width", x.bandwidth());
  }, [
    d3data,
    width,
    height,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    metric,
    barColor,
    chartSetup,
    sector,
  ]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={[0, 0, width, height]}
    >
      <g ref={title} />
      <g
        ref={gx}
        className="xaxis"
        transform={`translate(0, ${height - marginBottom})`}
      />
      <g
        ref={gy}
        className="yaxis"
        transform={`translate(${marginLeft}, 0)`}
      />
      <g
        ref={bars}
        className="bars"
      />
    </svg>
  );
}
