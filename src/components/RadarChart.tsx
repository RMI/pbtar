import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function RadarChart({
  data,
  width = 400,
  marginVertical = 0,
  marginHorizontal = 30,
  sector = "power",
  metric = "capacity",
}) {
  const [d3data, setD3data] = useState(
    data.data.filter(d => (d.sector == sector) & (d.metric == metric) & (d.year == 2022)),
  );
  const ref = useRef();

  const height = width;
  const containerWidth = width - (marginHorizontal * 2);
  const containerHeight = height - (marginVertical * 2);

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const axisLabelFactor = 1.12;
    const axisCircles = 5;
    const dotRadius = 3;
    const radius = (width / 2) - (2 * marginHorizontal);
    const axesDomain = Array.from(d3.union(d3data.map(d => d.technology)));
    const maxValue = d3.max(d3data, d => d.value);
    const angleSlice = Math.PI / 2 / axesDomain.length * 4;
    const axisColor = "#CDCDCD";

    const radarLine = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(d))
      .angle((d, i) => i * angleSlice);

    const rScale = d3.scaleLinear()
      .domain(d3.extent(d3data, d => d.value))
      .range([0, radius]);

    svg.selectAll('g').remove();

    const container = svg.append('g')
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr('transform', 'translate(' + ((width / 2) + marginHorizontal) + ',' + ((height / 2) + marginVertical) + ')');

<<<<<<< HEAD
  	var axisGrid = container.append("g")
      .attr("class", "axisWrapper");
||||||| parent of 9d54b17 (lint fix)
    var axisGrid = container.append("g").attr("class", "axisWrapper");
=======
    const axisGrid = container.append("g").attr("class", "axisWrapper");
>>>>>>> 9d54b17 (lint fix)

  	axisGrid.selectAll(".levels")
  	   .data(d3.range(1, axisCircles + 1).reverse())
  	   .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => radius / axisCircles * d)
        .style("fill", "none")
        .style("stroke", axisColor);

  	const axis = axisGrid.selectAll(".axis")
  		.data(axesDomain)
  		.enter()
        .append("g")
        .attr("class", "axis");

  	axis.append("line")
  		.attr("x1", 0)
  		.attr("y1", 0)
  		.attr("x2", (d, i) => rScale(maxValue*1.05) * Math.cos(angleSlice*i - Math.PI/2))
  		.attr("y2", (d, i) => rScale(maxValue*1.05) * Math.sin(angleSlice*i - Math.PI/2))
  		.attr("class", "line")
  		.style("stroke", axisColor)
  		.style("stroke-width", "2px");

  	axis.append("text")
  		.attr("class", "legend")
  		.style("font-size", "11px")
  		.attr("text-anchor", "middle")
      .attr("dy", "0.35em")
  		.attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
  		.attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
  		.text(d => d);

    const plots = container.append("g")
      .attr("class", "plot");

    plots.append('path')
      .attr("d", radarLine(d3data.map(d => d.value)))
      .attr("fill", "steelblue")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

  	plots.selectAll("circle")
  		.data(d3data)
      .join("circle")
  		  .attr("r", dotRadius)
  		  .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
  		  .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
  		  .attr("fill", "steelblue");
  }, [d3data]);

  function uniqueYears(data) {
    return data.data
      .reduce((a, b) => a.indexOf(b.year) < 0 ? a.concat([b.year]) : a, [])
      .sort()
  }

  const filterData = (selectedYear) =>
    setD3data(
      data.data.filter(
        d =>
          d.sector == sector &
          d.metric == metric &
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
      >
      </svg>
    </>
  );
}
