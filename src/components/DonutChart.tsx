import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function DonutChart({
  data,
  width = 400,
  sector = "power",
  metric = "capacity",
}) {
  const [d3data, setD3data] = useState(
    data.data.filter(
      (d) => (d.sector == sector) & (d.metric == metric) & (d.year == 2022),
    ),
  );
  const ref = useRef();

  const height = Math.min(500, width);
  const outerRadius = height / 2 - 10;
  const innerRadius = outerRadius * 0.5;

  const color = d3.scaleOrdinal(d3.schemeObservable10);

  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .padAngle(0.005);

  function show(d) {
    const big_percent = 0.15;
    const threshold = Math.PI * 2 * big_percent;
    return d.endAngle - d.startAngle > threshold ? "visible" : "hidden";
  }

  function percent(d) {
    return (
      Math.round(((d.endAngle - d.startAngle) / (Math.PI * 2)) * 100) + "%"
    );
  }

  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d.value);

  function isDark(color) {
    //http://www.w3.org/TR/AERT#color-contrast
    const rgb = d3.rgb(color);
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 < 128;
  }

  useEffect(() => {
    const svgElement = d3.select(ref.current);

    svgElement.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const path = svgElement
      .datum(d3data)
      .selectAll("path")
      .data(pie)
      .join("path")
      .attr("fill", (d, i) => color(i))
      .attr("data-year", (d) => d.data.year)
      .attr("data-value", (d) => d.data.value)
      .attr("data-technology", (d) => d.data.technology)
      .transition()
      .duration(750)
      .attrTween("d", arcTween);

    svgElement
      .datum(d3data)
      .selectAll(".label")
      .data(pie)
      .join("text")
      .text((d) => d.data.technology)
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("dy", -9)
      .attr("alignment-baseline", "middle")
      .attr("font-weight", "bold")
      .attr("fill", (d, i) => (isDark(color(i)) ? "white" : "black"))
      .attr("visibility", (d) => show(d))
      .transition()
      .attr("x", (d) => arc.centroid(d)[0])
      .attr("y", (d) => arc.centroid(d)[1])
      .duration(750);

    svgElement
      .datum(d3data)
      .selectAll(".label_value")
      .data(pie)
      .join("text")
      .text((d) => percent(d))
      .attr("class", "label_value")
      .attr("text-anchor", "middle")
      .attr("dy", 9)
      .attr("alignment-baseline", "middle")
      .attr("fill", (d, i) => (isDark(color(i)) ? "white" : "black"))
      .attr("visibility", (d) => show(d))
      .transition()
      .attr("x", (d) => arc.centroid(d)[0])
      .attr("y", (d) => arc.centroid(d)[1])
      .duration(750);
  }, [d3data]);

  function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(0);
    return (t) => arc(i(t));
  }

  function uniqueYears(data) {
    return data.data
      .reduce((a, b) => (a.indexOf(b.year) < 0 ? a.concat([b.year]) : a), [])
      .sort();
  }

  const filterData = (selectedYear) =>
    setD3data(
      data.data.filter(
        (d) =>
          (d.sector == sector) &
          (d.metric == metric) &
          (d.year == selectedYear),
      ),
    );

  return (
    <>
      <label>
        Year:
        <select onChange={(e) => filterData(e.target.value)}>
          {data && uniqueYears(data).map((e) => <option value={e}>{e}</option>)}
        </select>
      </label>
      <svg
        ref={ref}
        width={width}
        height={height}
      ></svg>
    </>
  );
}
