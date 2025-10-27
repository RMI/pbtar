import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function DonutChart({
  data,
  width = 600,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20,
}) {
  const [d3data, setD3data] = useState(
    data.data.filter((d) => (d.sector == "Power") & (d.metric == "Capacity") & (d.year == 2022)),
  );
  const ref = useRef();

  const height = Math.min(500, width / 2);

  useEffect(() => {
    const svgElement = d3.select(ref.current);

    const outerRadius = (height) / 2 - 10;
    const innerRadius = outerRadius * 0.40;
    const tau = 2 * Math.PI;
    const color = d3.scaleOrdinal(d3.schemeObservable10);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pie = d3.pie().sort(null).value((d) => d.value);

    svgElement.attr("viewBox", [-width/2, -height/2, width, height]);

    svgElement.datum(d3data).selectAll("path")
      .data(pie)
      .join("path")
        .attr("fill", (d, i) => color(i))
        .attr("d", arc)
        .attr("data-year", (d) => d.year)
        .attr("data-value", (d) => d.value)
        .attr("data-technology", (d) => d.technology)
        .each(function(d) { this._current = d; }); // store the initial angles
  }, [d3data]);

  const filterData = (selectedTech) =>
    setD3data(
      data.data.filter(
        (d) =>
          (d.sector == "Power") &
          (d.technology == selectedTech) &
          (d.metric == "Capacity"),
      ),
    );

  return (
    <>
      <label>
        Year:
        <select onChange={(e) => filterData(e.target.value)}>
          {d3data && d3data.reduce(function(a, b) { return (a.indexOf(b.year) < 0) ? a.concat([b.year]) : a; }, []).sort().map(e => (
            <>
              <option value = {e}>{e}</option>
            < />
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
