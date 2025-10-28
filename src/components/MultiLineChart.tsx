import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function MultiLineChart({
  data,
  width = 600,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40,
}) {
  const [d3data, setD3data] = useState(
    data.data.filter(d => (d.sector == "Power") & (d.metric == "Capacity")),
  );
  const ref = useRef();
  const gx = useRef();
  const gy = useRef();
  const lines = useRef();
  const dots = useRef();

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    const linesGroup = d3.select(lines.current);
    const dotsGroup = d3.select(dots.current);

    const utc = d3.utcParse("%Y");
    const years = d3.extent(d3data, d => utc(d.year));
    const values = d3.extent(d3data, d => d.value);
    const xticks = [...new Set(d3data.map(d => d.year))].map(utc);

    const x = d3.scaleUtc(years, [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(values, [height - marginBottom, marginTop]);

    const line = d3.line()
      .x(d => x(utc(d.year)))
      .y(d => y(d.value));

    d3.select(gx.current)
      .transition()
      .duration(750)
      .call(d3.axisBottom(x).tickValues(xticks));

    d3.select(gy.current)
      .transition()
      .duration(750)
      .call(d3.axisLeft(y));

    const groupedData = d3.groups(d3data, d => d.technology);

    linesGroup
      .selectAll(".line")
      .data(groupedData)
      .join("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "var(--color-coal)")
        .attr("stroke-width", 1)
        .attr("d", d => line(d[1]))
        .attr("data-year", d => d[1].year)
        .attr("data-value", d => d[1].value)
        .attr("data-geography", d => d[1].geography)
        .attr("data-metric", d => d[1].metric)
        .attr("data-sector", d => d[1].sector)
        .attr("data-technology", d => d[1].technology)
        .attr("data-unit", d => d[1].unit);
  }, [d3data]);

  const highlightSelectedTech = (selectedTech) => {
    d3.select(lines.current)
      .selectAll(".line")
      .attr("stroke", d => d[0] == selectedTech ? "var(--color-donate)" : "var(--color-coal)")
      .attr("stroke-width", d => d[0] == selectedTech ? 3 : 1);
  }

  function uniqueTechs(data) {
    return data.data
      .reduce((a, b) => a.indexOf(b.technology) < 0 ? a.concat([b.technology]) : a, [])
  }

  return (
    <>
      <label>
        Highlight:
        <select onChange={(e) => highlightSelectedTech(e.target.value)}>
          <option value=""></option>
          {data && uniqueTechs(data).map(e => (
            <option value={e}>{e}</option>
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
