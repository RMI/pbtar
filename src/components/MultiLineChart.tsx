import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

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
}) {
  const [d3data, setD3data] = useState(
    data.data.filter((d) => (d.sector == sector) & (d.metric == metric)),
  );
  const ref = useRef();
  const gx = useRef();
  const gy = useRef();
  const lines = useRef();
  const dots = useRef();
  const selectRef = useRef();

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    const linesGroup = d3.select(lines.current);
    const dotsGroup = d3.select(dots.current);

    const utc = d3.utcParse("%Y");
    const years = d3.extent(d3data, (d) => utc(d.year));
    const values = d3.extent(d3data, (d) => d.value);
    const xticks = [...new Set(d3data.map((d) => d.year))].map(utc);

    const x = d3.scaleUtc(years, [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(values, [height - marginBottom, marginTop]);

    const line = d3
      .line()
      .x((d) => x(utc(d.year)))
      .y((d) => y(d.value));

    d3.select(gx.current)
      .transition()
      .duration(750)
      .call(d3.axisBottom(x).tickValues(xticks))
      .style("font-size", "14px")
      .style("font-weight", "bold");

    d3.select(gy.current)
      .transition()
      .duration(750)
      .call(d3.axisLeft(y))
      .style("font-size", "12px");

    const groupedData = d3.groups(d3data, (d) => d.technology);

    const selectedTech = selectRef.current.value;

    linesGroup
      .selectAll(".line")
      .data(groupedData)
      .join("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", (d) =>
        d[0] == selectedTech ? "var(--color-donate)" : "var(--color-coal)",
      )
      .attr("stroke-width", (d) => (d[0] == selectedTech ? 3 : 1))
      .attr("d", (d) => line(d[1]))
      .attr("data-year", (d) => d[1].year)
      .attr("data-value", (d) => d[1].value)
      .attr("data-geography", (d) => d[1].geography)
      .attr("data-metric", (d) => d[1].metric)
      .attr("data-sector", (d) => d[1].sector)
      .attr("data-technology", (d) => d[1].technology)
      .attr("data-unit", (d) => d[1].unit);

    linesGroup
      .selectAll(".label")
      .data(groupedData)
      .join("text")
      .text((d) => d[0])
      .attr("class", "label")
      .attr("x", (d) => x(new Date(d[1].slice(-1)[0].year, 0, 1, 0, 0)))
      .attr("y", (d) => y(d[1].slice(-1)[0].value))
      .attr("dx", 12)
      .attr("dy", 5);
  }, [d3data]);

  const highlightSelectedTech = (selectedTech) => {
    d3.select(lines.current)
      .selectAll(".line")
      .attr("stroke", (d) =>
        d[0] == selectedTech ? "var(--color-donate)" : "var(--color-coal)",
      )
      .attr("stroke-width", (d) => (d[0] == selectedTech ? 3 : 1));
  };

  function uniqueTechs(data) {
    return [...d3.union(data.data.map((a) => a.technology).filter((n) => n))];
  }

  return (
    <>
      <label>
        Highlight:
        <select
          ref={selectRef}
          onChange={(e) => highlightSelectedTech(e.target.value)}
        >
          {data && uniqueTechs(data).map((e) => <option value={e}>{e}</option>)}
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
