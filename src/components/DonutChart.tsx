import { select, Selection } from "d3-selection";
import { arc, pie, PieArcDatum, DefaultArcObject } from "d3-shape";
import { interpolate } from "d3-interpolate";
import { rgb } from "d3-color";
import { useRef, useEffect, useState, useMemo } from "react";

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

  const createArc = useMemo(() => {
    return arc<PieArcDatum<DataPoint>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padAngle(0.005);
  }, [innerRadius, outerRadius]);

  const createPie = useMemo(() => {
    return pie<DataPoint>()
      .sort(null)
      .value((d) => d.value);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const show = (d: PieArcDatum<DataPoint>): "visible" | "hidden" => {
      const bigPercent = 0.15;
      const threshold = Math.PI * 2 * bigPercent;
      return d.endAngle - d.startAngle > threshold ? "visible" : "hidden";
    };

    const percent = (d: PieArcDatum<DataPoint>): string => {
      return `${Math.round(((d.endAngle - d.startAngle) / (Math.PI * 2)) * 100)}%`;
    };

    const isDark = (color: string): boolean => {
      const rgbColor = rgb(color);
      if (!rgbColor) return false;
      return (
        (rgbColor.r * 299 + rgbColor.g * 587 + rgbColor.b * 114) / 1000 < 128
      );
    };

    const arcTween = (d: PieArcDatum<DataPoint>) => {
      const interpolator = interpolate({ startAngle: 0, endAngle: 0 }, d);
      return (t: number) => createArc(interpolator(t)) ?? "";
    };

    const svgElement = select<SVGSVGElement, unknown>(ref.current);
    svgElement.attr(
      "viewBox",
      [-width / 2, -height / 2, width, height].join(","),
    );

    const d3dataSorted = [...d3data].sort(
      (a, b) =>
        Object.keys(technologyColors).indexOf(a.technology) -
        Object.keys(technologyColors).indexOf(b.technology),
    );

    const pieData = createPie(d3dataSorted);

    // Update paths
    svgElement
      .selectAll<SVGPathElement, PieArcDatum<DataPoint>>("path")
      .data(pieData)
      .join("path")
      .attr("fill", (d) => technologyColors[d.data.technology])
      .attr("data-year", (d) => d.data.year)
      .attr("data-value", (d) => d.data.value)
      .attr("data-technology", (d) => d.data.technology)
      .transition()
      .duration(750)
      .attrTween("d", arcTween);

    // Update labels
    svgElement
      .selectAll<SVGTextElement, PieArcDatum<DataPoint>>(".label")
      .data(pieData)
      .join("text")
      .attr("class", "label")
      .text((d) => d.data.technology)
      .attr("text-anchor", "middle")
      .attr("dy", "-9")
      .attr("alignment-baseline", "middle")
      .attr("font-weight", "bold")
      .attr("fill", (d) =>
        isDark(technologyColors[d.data.technology]) ? "white" : "black",
      )
      .attr("visibility", show)
      .transition()
      .duration(750)
      .attr("transform", (d) => {
        const [x, y] = createArc.centroid(d);
        return `translate(${x},${y})`;
      });

    // Update value labels
    svgElement
      .selectAll<SVGTextElement, PieArcDatum<DataPoint>>(".label_value")
      .data(pieData)
      .join("text")
      .attr("class", "label_value")
      .text(percent)
      .attr("text-anchor", "middle")
      .attr("dy", "9")
      .attr("alignment-baseline", "middle")
      .attr("fill", (d) =>
        isDark(technologyColors[d.data.technology]) ? "white" : "black",
      )
      .attr("visibility", show)
      .transition()
      .duration(750)
      .attr("transform", (d) => {
        const [x, y] = createArc.centroid(d);
        return `translate(${x},${y})`;
      });
  }, [d3data, width, height, createArc, createPie]);

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
            uniqueYears(data).map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
        </select>
      </label>
      <svg
        ref={ref}
        width={width}
        height={height}
      />
    </>
  );
}
