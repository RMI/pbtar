import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

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
}) {
  const [d3data, setD3data] = useState(
    data.data.filter((d) => (d.sector == sector) & (d.metric == metric)),
  );
  const ref = useRef();
  const gx = useRef();
  const gy = useRef();
  const areas = useRef();

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    const areasGroup = d3.select(areas.current);

    const utc = d3.utcParse("%Y");
    const years = d3.extent(d3data, (d) => utc(d.year));
    const values = d3.extent(d3data, (d) => d.value);
    const xticks = [...new Set(d3data.map((d) => d.year))].map(utc);

    const x = d3.scaleUtc(years, [marginLeft, width - marginRight]);

    const y = d3.scaleLinear().rangeRound([height - marginBottom, marginTop]);

    const series = d3
      .stack()
      .offset(d3.stackOffsetExpand)
      .keys(d3.union(d3data.map((d) => d.technology)))
      .value(([, D], key) => D.get(key).value)(
      d3.index(
        d3data,
        (d) => d.year,
        (d) => d.technology,
      ),
    );

    const color = d3
      .scaleOrdinal()
      .domain(series.map((d) => d.technology))
      .range(d3.schemeTableau10);

    const area = d3
      .area()
      .x((d) => x(utc(d.data[0])))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]));

    d3.select(gx.current)
      .transition()
      .duration(750)
      .call(d3.axisBottom(x).tickValues(xticks))
      .style("font-size", "14px")
      .style("font-weight", "bold");

    d3.select(gy.current)
      .transition()
      .duration(750)
      .call(d3.axisLeft(y).ticks(5, "%"))
      .style("font-size", "12px");

    areasGroup
      .selectAll()
      .data(series)
      .join("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", (d) => area(d));
  }, [d3data]);

  return (
    <>
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
    </>
  );
}
