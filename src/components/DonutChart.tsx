import { select, Selection } from "d3-selection";
import { arc, pie, PieArcDatum, DefaultArcObject } from "d3-shape";
import { interpolate } from "d3-interpolate";
import { rgb } from "d3-color";
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

  // Create arc generator with explicit typing
  const createArc = useMemo(() => {
    const arcGenerator = arc<PieArcDatum<DataPoint>, DefaultArcObject>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padAngle(0.005);
    return arcGenerator;
  }, [innerRadius, outerRadius]);

  // Create pie generator with explicit typing
  const createPie = useMemo(() => {
    const pieGenerator = pie<DataPoint>()
      .sort(null)
      .value((d) => d.value);
    return pieGenerator;
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const show = (d: PieArcDatum<DataPoint>): "visible" | "hidden" => {
      const big_percent = 0.15;
      const threshold = Math.PI * 2 * big_percent;
      return d.endAngle - d.startAngle > threshold ? "visible" : "hidden";
    };

    const percent = (d: PieArcDatum<DataPoint>): string => {
      return `${Math.round(((d.endAngle - d.startAngle) / (Math.PI * 2)) * 100)}%`;
    };

    const isDark = (color: string): boolean => {
      const rgbColor = rgb(color);
      return (
        (rgbColor.r * 299 + rgbColor.g * 587 + rgbColor.b * 114) / 1000 < 128
      );
    };

    const arcTween = (d: PieArcDatum<DataPoint>) => {
      const interpolator = interpolate({ startAngle: 0, endAngle: 0 }, d);
      return (t: number) => createArc(interpolator(t)) || "";
    };

    type UpdateSelection = Selection<
      SVGPathElement | SVGTextElement,
      PieArcDatum<DataPoint>,
      SVGSVGElement,
      unknown
    >;

    const svgElement = select<SVGSVGElement, unknown>(ref.current);
    svgElement.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const d3dataSorted = [...d3data].sort(
      (a, b) =>
        Object.keys(technologyColors).indexOf(a.technology) -
        Object.keys(technologyColors).indexOf(b.technology),
    );

    const pieData = createPie(d3dataSorted);

    // Create and update paths
    (
      svgElement
        .selectAll<SVGPathElement, PieArcDatum<DataPoint>>("path")
        .data(pieData)
        .join("path") as UpdateSelection
    )
      .attr("fill", (d) => technologyColors[d.data.technology])
      .attr("data-year", (d) => d.data.year)
      .attr("data-value", (d) => d.data.value)
      .attr("data-technology", (d) => d.data.technology)
      .transition()
      .duration(750)
      .attrTween("d", arcTween);

    // Create and update labels
    (
      svgElement
        .selectAll<SVGTextElement, PieArcDatum<DataPoint>>(".label")
        .data(pieData)
        .join("text") as UpdateSelection
    )
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
    (
      svgElement
        .selectAll<SVGTextElement, PieArcDatum<DataPoint>>(".label_value")
        .data(pieData)
        .join("text") as UpdateSelection
    )
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
