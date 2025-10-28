import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function DonutChart({
  data,
  width = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}) {
  const [d3data, setD3data] = useState(
    data.data.filter(d => (d.sector == "power") & (d.metric == "capacity") & (d.year == 2022)),
  );
  const ref = useRef();

  const height = Math.min(500, width);
  const outerRadius = height / 2 - 10;
  const innerRadius = outerRadius * 0.5;

  const tau = 2 * Math.PI;
  const color = d3.scaleOrdinal(d3.schemeObservable10);

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const pie = d3.pie().sort(null).value(d => d.value);

  useEffect(() => {
    const svgElement = d3.select(ref.current);

    svgElement.attr("viewBox", [-width/2, -height/2, width, height]);

    const path = svgElement.datum(d3data).selectAll("path")
      .data(pie)
      .join("path")
        .attr("fill", (d, i) => color(i))
        .attr("data-year", d => d.data.year )
        .attr("data-value", d => d.data.value)
        .attr("data-technology", d => d.data.technology)
        .transition()
        .duration(750)
        .attrTween("d", arcTween);
  }, [d3data]);

  function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(0);
    return (t) => arc(i(t));
  }

  function uniqueYears(data) {
    return data.data
      .reduce((a, b) => a.indexOf(b.year) < 0 ? a.concat([b.year]) : a, [])
      .sort()
  }

  const filterData = (selectedYear) =>
    setD3data(
      data.data.filter(
        d =>
          d.sector == "power" &
          d.metric == "capacity" &
          d.year == selectedYear
      )
    );

  return (
    <>
      <label>
        Year:
        <select onChange={(e) => filterData(e.target.value)}>
          {data && uniqueYears(data).map(e => (
            <option value={e}>{e}</option>
          ))}
        </select>
      </label>
      <svg
        ref={ref}
        width={width}
        height={height}
      >
      </svg>
    </>
  );
}
