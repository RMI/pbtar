<script type="module">
  import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
  import { feature, mesh } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

  const mount = document.getElementById("coverage-map");

  // --- Region definitions (ISO-3166 numeric codes as 3-digit strings) ---
  // EU-27 (as of 2025)
  const EU = new Set([
    "040","056","100","191","196","203","208","233","246","250","276","300","348",
    "372","380","428","440","442","470","528","616","620","642","703","705","724","752"
  ]);

  // South‑eastern Asia (UN M49 definition; includes Timor‑Leste 626)
  const SEA = new Set(["096","104","116","360","418","458","608","626","702","704","764"]);

  // --- Render ---
  const width  = mount.clientWidth || 520;
  const height = Math.round(width * 0.55);

  const svg = d3.select(mount)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "World map with EU and South-eastern Asia highlighted");

  const projection = d3.geoNaturalEarth1().fitExtent([[2,2],[width-2,height-2]], {type: "Sphere"});
  const path = d3.geoPath(projection);

  const world = await (await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")).json();
  const countries = feature(world, world.objects.countries).features;

  // Sphere / water
  svg.append("path").datum({type:"Sphere"}).attr("d", path).attr("class", "sphere");

  // Countries
  svg.append("g")
    .selectAll("path")
    .data(countries)
    .join("path")
      .attr("d", path)
      .attr("class", d => {
        const code = String(d.id).padStart(3, "0");
        const inEU  = EU.has(code);
        const inSEA = SEA.has(code);
        return inEU && inSEA ? "both" : inEU ? "eu" : inSEA ? "sea" : "country";
      })
    .append("title")
      .text(d => d.properties?.name ?? ""); // Tooltip with country name

  // Country borders (hairline)
  svg.append("path")
    .datum(mesh(world, world.objects.countries, (a, b) => a !== b))
    .attr("class", "borders")
    .attr("d", path);

  // Legend
  const g = svg.append("g").attr("transform", `translate(${12},${12})`);
  const items = [
    { cls: "eu",  label: "EU" },
    { cls: "sea", label: "South‑eastern Asia (UN M49)" }
  ];
  g.selectAll("rect")
    .data(items)
    .enter()
    .append("rect")
    .attr("x", 0).attr("y", (_,i) => i*18).attr("width", 14).attr("height", 14)
    .attr("class", d => d.cls);
  g.selectAll("text")
    .data(items)
    .enter()
    .append("text")
    .attr("x", 20).attr("y", (_,i) => i*18 + 11)
    .attr("class", "legend-label")
    .text(d => d.label);

  // Resize handler (optional)
  addEventListener("resize", () => {
    const w = mount.clientWidth || width;
    const h = Math.round(w * 0.55);
    svg.attr("viewBox", `0 0 ${w} ${h}`);
  });
</script>

<style>
  /* Accessible, neutral base */
  #coverage-map svg { width: 100%; height: auto; display: block; }
  .sphere   { fill: #e6f0f8; }
  .country  { fill: #eef2f6; stroke: #ffffff; stroke-width: 0.35; }
  .eu       { fill: #2f7ed8; stroke: #ffffff; stroke-width: 0.35; }  /* blue */
  .sea      { fill: #f28e2b; stroke: #ffffff; stroke-width: 0.35; }  /* orange */
  .both     { fill: #8b6bdc; stroke: #ffffff; stroke-width: 0.35; }  /* reserved if sets overlap */
  .borders  { fill: none; stroke: #ffffff; stroke-width: 0.35; }
  .legend-label { font: 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; fill: #111; }
</style>