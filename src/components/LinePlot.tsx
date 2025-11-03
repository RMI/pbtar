import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function LinePlot({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40
}) {
  const [d3data, setD3data] = useState(data.data.filter(d => d.sector == 'Power' & d.metric == "Capacity"));
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
      .transition().duration(750)
      .call(d3.axisBottom(x).tickValues(xticks));
    d3.select(gy.current)
      .transition().duration(750)
      .call(d3.axisLeft(y));

    const groupedData = d3.groups(d3data, d => d.technology);
    const groupNames = groupedData.map(d => d[0]);
    const groupColor = d3.scaleOrdinal()
      .domain(['Biomass', 'Wind', 'Hydro', 'Solar', 'Oil', 'Coal', 'Gas'])
      .range(['var(--color-slate)', 'var(--color-pine)', 'var(--color-donate)', 'var(--color-solar)', 'var(--color-deficient)', 'var(--color-coal)', 'var(--color-calm)']);

    linesGroup.selectAll(".line")
      .data(groupedData)
      .join("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke", d => groupColor(d[0]))
        .attr("stroke-width", 1.5)
        .attr("d", d => line(d[1]));

    dotsGroup.selectAll("circle")
      .data(d3data)
      .join("circle")
        .attr("key", (d, i) => i)
        .attr("cx", d => x(utc(d.year)))
        .attr("cy", d => y(d.value))
        .attr("fill", d => groupColor(d.technology))
        .attr("stroke", d => groupColor(d.technology))
        .attr("stroke-width", 1.5)
        .attr("data-year", d => d.year)
        .attr("data-value", d => d.value)
        .attr("data-geography", d => d.geography)
        .attr("data-metric", d => d.metric)
        .attr("data-sector", d => d.sector)
        .attr("data-technology", d => d.technology)
        .attr("data-unit", d => d.unit)
        .attr("r", 2.5)
  }, [d3data])

  const filterData = (selectedTech) => (
    setD3data(data.data.filter(d => d.sector == 'Power' & d.technology == selectedTech & d.metric == "Capacity"))
  )

  const showAll = () => (
    setD3data(data.data.filter(d => d.sector == 'Power' & d.metric == "Capacity"))
  )

  return (
    <>
      <button
        onClick={showAll}
        className="px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
      >
        showAll
      </button>
      <label>
        Pick a technology:
        <select onChange={e => filterData(e.target.value)}>
          <option value="Coal">Coal</option>
          <option value="Oil">Oil</option>
          <option value="Gas">Gas</option>
          <option value="Wind">Wind</option>
          <option value="Solar">Solar</option>
          <option value="Biomass">Biomass</option>
          <option value="Hydro">Hydro</option>
        </select>
      </label>
      <svg ref={ref} width={width} height={height}>
        <g ref={gx} transform={`translate(0, ${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft}, 0)`} />
        <g ref={lines} />
        <g ref={dots} />
      </svg>
    </>
  );
}
