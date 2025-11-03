import * as d3 from "d3";
import { useRef, useEffect, useState, useMemo } from "react";

interface DataPoint {
  sector: string;
  metric: string;
  year: number;
  technology: keyof typeof technologyColors;
  value: number;
}

interface ChartData {
  data: DataPoint[];
}

interface DonutChartProps {
  data: ChartData;
  width?: number;
  sector?: string;
  metric?: string;
}

type ArcDatum = d3.PieArcDatum<DataPoint>;

const technologyColors = {
  coal: "#DF4E39",
  oil: "#AB3C2C",
  gas: "#F7988B",
  other: "#B3BCC5",
  biomass: "#91CBF2",
  hydro: "#2888C9",
  wind: "#005A96",
  solar: "#003B63",
} as const;

export default function DonutChart({
  data,
  width = 400,
  sector = "power",
  metric = "capacity",
}: DonutChartProps) {
  const [d3data, setD3data] = useState<DataPoint[]>(() =>
    data.data.filter(
      (d) => d.sector === sector && d.metric === metric && d.year === 2022,
    ),
  );

  const ref = useRef<SVGSVGElement>(null);

  const height = Math.min(500, width);
  const outerRadius = height / 2 - 10;
  const innerRadius = outerRadius * 0.5;

  const arc = useMemo(() => {
    return d3.arc<ArcDatum>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padAngle(0.005);
  }, [innerRadius, outerRadius]);

  const pie = useMemo(() => {
    return d3.pie<DataPoint>()
      .sort(null)
      .value((d) => d.value);
  }, []);

  const show = (d: ArcDatum): "visible" | "hidden" => {
    const big_percent = 0.15;
    const threshold = Math.PI * 2 * big_percent;
    return d.endAngle - d.startAngle > threshold ? "visible" : "hidden";
  };

  const percent = (d: ArcDatum): string => {
    return `${Math.round(((d.endAngle - d.startAngle) / (Math.PI * 2)) * 100)}%`;
  };

  const isDark = (color: string): boolean => {
    const rgb = d3.rgb(color);
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 < 128;
  };

  function arcTween(this: d3.BaseType, a: ArcDatum) {
    const i = d3.interpolate(
      (this as any)._current || { startAngle: 0, endAngle: 0 },
      a,
    );
    (this as any)._current = i(0);
    return (t: number) => {
      const value = i(t);
      return arc(value) || "";
    };
  }

  useEffect(() => {
    if (!ref.current) return;

    const svgElement = d3.select<SVGSVGElement, DataPoint[]>(ref.current);

    svgElement.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const d3dataSorted = [...d3data].sort(
      (a, b) =>
        Object.keys(technologyColors).indexOf(a.technology) -
        Object.keys(technologyColors).indexOf(b.technology),
    );

    const path = svgElement
      .datum(d3dataSorted)
      .selectAll<SVGPathElement, ArcDatum>("path")
      .data(pie)
      .join("path")
      .attr("fill", (d) => technologyColors[d.data.technology])
      .attr("data-year", (d) => d.data.year)
      .attr("data-value", (d) => d.data.value)
      .attr("data-technology", (d) => d.data.technology)
      .transition()
      .duration(750)
      .attrTween("d", arcTween);

    svgElement
      .datum(d3dataSorted)
      .selectAll<SVGTextElement, ArcDatum>(".label")
      .data(pie)
      .join("text")
      .text((d) => d.data.technology)
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("dy", "-9")
      .attr("alignment-baseline", "middle")
      .attr("font-weight", "bold")
      .attr("fill", (d) =>
        isDark(technologyColors[d.data.technology]) ? "white" : "black",
      )
      .attr("visibility", show)
      .transition()
      .attr("x", (d) => arc.centroid(d)[0])
      .attr("y", (d) => arc.centroid(d)[1])
      .duration(750);

    svgElement
      .datum(d3dataSorted)
      .selectAll<SVGTextElement, ArcDatum>(".label_value")
      .data(pie)
      .join("text")
      .text(percent)
      .attr("class", "label_value")
      .attr("text-anchor", "middle")
      .attr("dy", "9")
      .attr("alignment-baseline", "middle")
      .attr("fill", (d) =>
        isDark(technologyColors[d.data.technology]) ? "white" : "black",
      )
      .attr("visibility", show)
      .transition()
      .attr("x", (d) => arc.centroid(d)[0])
      .attr("y", (d) => arc.centroid(d)[1])
      .duration(750);
  }, [d3data, width, height, arc, pie]);

  const uniqueYears = (data: ChartData): number[] => {
    return Array.from(new Set(data.data.map((d) => d.year))).sort();
  };

  const filterData = (selectedYear: string): void => {
    setD3data(
      data.data.filter(
        (d) =>
          d.sector === sector &&
          d.metric === metric &&
          d.year === Number(selectedYear),
      ),
    );
  };

  return (
    <>
      <label>
        Year:
        <select onChange={(e) => filterData(e.target.value)}>
          {data &&
            uniqueYears(data).map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
        </select>
      </label>
      <svg ref={ref} width={width} height={height} />
    </>
  );
}
