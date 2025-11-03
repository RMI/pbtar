import * as d3 from "d3";
import { useRef, useEffect, useState, useMemo } from "react";

type PieArcDatum = d3.PieArcDatum<DataPoint>;

interface ArcType extends d3.Arc<any, PieArcDatum> {
  innerRadius: (radius: number) => ArcType;
  outerRadius: (radius: number) => ArcType;
  padAngle: (angle: number) => ArcType;
}

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

  const createArc = useMemo(() => {
    const arc = d3.arc<PieArcDatum>() as ArcType;
    return arc
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padAngle(0.005);
  }, [innerRadius, outerRadius]);

  // Create pie generator with explicit typing
  const createPie = useMemo(() => {
    const pieGenerator: d3.Pie<any, DataPoint> = d3
      .pie<DataPoint>()
      .sort(null)
      .value((d) => d.value);
    return pieGenerator;
  }, []);

  const show = (d: d3.PieArcDatum<DataPoint>): "visible" | "hidden" => {
    const big_percent = 0.15;
    const threshold = Math.PI * 2 * big_percent;
    return d.endAngle - d.startAngle > threshold ? "visible" : "hidden";
  };

  const percent = (d: d3.PieArcDatum<DataPoint>): string => {
    return `${Math.round(((d.endAngle - d.startAngle) / (Math.PI * 2)) * 100)}%`;
  };

  const isDark = (color: string): boolean => {
    const rgb = d3.rgb(color);
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 < 128;
  };

  const arcTween = (d: d3.PieArcDatum<DataPoint>) => {
    const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
    return (t: number) => createArc(interpolate(t)) || "";
  };

  useEffect(() => {
    if (!ref.current) return;

    const svgElement = d3.select<SVGSVGElement, DataPoint[]>(ref.current);
    svgElement.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const d3dataSorted = [...d3data].sort(
      (a, b) =>
        Object.keys(technologyColors).indexOf(a.technology) -
        Object.keys(technologyColors).indexOf(b.technology),
    );

    // Explicitly type the pie data
    const pieData = createPie(d3dataSorted);

    // Create and update paths
    svgElement
      .selectAll<SVGPathElement, d3.PieArcDatum<DataPoint>>("path")
      .data(pieData)
      .join("path")
      .attr("fill", (d) => technologyColors[d.data.technology])
      .attr("data-year", (d) => d.data.year)
      .attr("data-value", (d) => d.data.value)
      .attr("data-technology", (d) => d.data.technology)
      .transition()
      .duration(750)
      .attrTween("d", arcTween);

    // Create and update labels
    svgElement
      .selectAll<SVGTextElement, d3.PieArcDatum<DataPoint>>(".label")
      .data(pieData)
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
      .duration(750)
      .attr("x", (d) => {
        const centroid = createArc.centroid(d);
        return centroid[0];
      })
      .attr("y", (d) => {
        const centroid = createArc.centroid(d);
        return centroid[1];
      });

    // Create and update value labels
    svgElement
      .selectAll<SVGTextElement, d3.PieArcDatum<DataPoint>>(".label_value")
      .data(pieData)
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
      .duration(750)
      .attr("x", (d) => {
        const centroid = createArc.centroid(d);
        return centroid[0];
      })
      .attr("y", (d) => {
        const centroid = createArc.centroid(d);
        return centroid[1];
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
            uniqueYears(data).map((e) => (
              <option
                key={e}
                value={e}
              >
                {e}
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
