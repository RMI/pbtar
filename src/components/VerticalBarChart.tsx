import * as d3 from "d3";
import { useRef, useEffect, useState, useMemo } from "react";

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
  const [d3data, setD3data] = useState<DataPoint[]>(() =>
    data.data.filter((d) => d.sector === sector && d.metric === metric),
  );

  const svgRef = useRef<SVGSVGElement>(null);

  // Memoize scales and data transformations
  const chartSetup = useMemo(() => {
    const unit = d3data[0]?.unit ?? "";

    const x = d3
      .scaleBand()
      .domain(d3data.map((d) => d.year).sort())
      .range([marginLeft, width - marginRight])
      .padding(0.6);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(d3data, (d) => d.value) ?? 0])
      .range([height - marginBottom, marginTop]);

    return { x, y, unit };
  }, [d3data, width, height, marginLeft, marginRight, marginTop, marginBottom]);

  useEffect(() => {
    if (!svgRef.current || !chartSetup) return;

    const { x, y, unit } = chartSetup;
    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll("*").remove();

    // Set up SVG
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Add title
    const title = svg.append("g").attr("class", "title");

    title
      .append("text")
      .text(metric)
      .attr("dy", "15")
      .attr("font-weight", "bold")
      .attr("font-variant", "small-caps");

    title.append("text").text(unit).attr("dy", "30");

    // Add X axis
    svg
      .append("g")
      .attr("class", "xaxis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSize(0) as any)
      .style("font-size", "14px")
      .style("font-weight", "bold");

    // Add Y axis
    const yAxis = svg
      .append("g")
      .attr("class", "yaxis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSize(0) as any)
      .style("font-size", "12px");

    yAxis.select(".domain").remove();

    yAxis
      .selectAll(".tick line")
      .clone()
      .attr("x2", width)
      .attr("stroke-opacity", "0.1");

    // Add bars
    svg
      .append("g")
      .attr("class", "bars")
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
  ]);

  return <svg ref={svgRef} />;
}
