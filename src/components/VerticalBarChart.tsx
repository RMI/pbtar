import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function VerticalBarChart({
  data,
  width = 640,
  height = 400,
  marginTop = 45,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
  metric = "emissionsIntensity",
  barColor = "midnightblue"
}) {
  const [d3data, setD3data] = useState(
    data.data.filter((d) => (d.sector == "power") & (d.metric == metric)),
  );
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const unit = d3data.map(d => d.unit)[0];

    const x = d3.scaleBand()
        .domain(d3data.map(d => d.year).sort())
        .range([marginLeft, width - marginRight])
        .padding(0.6);

    const y = d3.scaleLinear()
        .domain([0, d3.max(d3data, d => d.value)])
        .range([height - marginBottom, marginTop]);

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const title = svg.append("g").attr("class", "title");

    title
      .append('text')
      .text(metric)
        .attr('dy', 15)
        .attr('font-weight', 'bold')
        .attr('font-variant', 'small-caps');

    title
      .append('text')
        .text(unit)
        .attr('dy', 30);

    svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .style("font-size", "14px")
      .style("font-weight", "bold");

    svg.append("g")
      .attr("class", "yaxis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .style("font-size", "12px")
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.1));

    svg.append("g")
      .attr("class", "bars")
      .attr("fill", barColor)
      .selectAll()
      .data(d3data)
      .join("rect")
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => y(0) - y(d.value))
        .attr("width", x.bandwidth());
  }, [d3data]);

  return (
    <>
      <svg ref={svgRef} />
    </>
  );
}
