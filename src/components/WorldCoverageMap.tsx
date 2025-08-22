import React, { useEffect, useRef, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

// We'll dynamically import the world-atlas TopoJSON (countries-110m) once on mount.
// If network fetch is undesired, world-atlas can be added as a dependency and imported locally.

export interface WorldCoverageMapProps { className?: string; regions?: string[]; bare?: boolean }

// EU-27 (2025) ISO-3166 numeric (3-digit strings)
const EU = new Set([
  '040','056','100','191','196','203','208','233','246','250','276','300','348',
  '372','380','428','440','442','470','528','616','620','642','703','705','724','752'
]);

// South‑eastern Asia (UN M49) including Timor-Leste (626)
const SEA = new Set(['096','104','116','360','418','458','608','626','702','704','764']);

type Topology = any; // minimal typing for quick integration


const WorldCoverageMap: React.FC<WorldCoverageMapProps> = ({ className = '', regions = [], bare = false }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

  async function draw() {
      try {
        // Fetch world topojson (110m resolution)
        const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const world: Topology = await res.json();
        if (cancelled) return;

  // TopoJSON -> GeoJSON FeatureCollection
  const countries = (feature(world, (world.objects as any).countries) as any).features as any[];
        const borders = mesh(world, world.objects.countries, (a: any, b: any) => a !== b);

        const svg = svgRef.current;
        if (!svg) return;

        const width = 1000; // fixed internal viewBox size
        const height = 550; // slightly taller for legend spacing
        const projection = geoNaturalEarth1().fitExtent([[2,2],[width-2,height-2]], { type: 'Sphere' });
        const path = geoPath(projection);

        // Clear existing (in case of hot reload)
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        // Sphere / water
        const sphere = document.createElementNS('http://www.w3.org/2000/svg','path');
        sphere.setAttribute('d', path({ type: 'Sphere' }) || '');
        sphere.setAttribute('class','wc-sphere');
        svg.appendChild(sphere);

        // Countries group
        const gCountries = document.createElementNS('http://www.w3.org/2000/svg','g');
        svg.appendChild(gCountries);

        // Region sets (numeric ISO codes as zero-padded strings)
        const AMERICAS = new Set([
          // North America
          '124','840','484','188','084','332','044','092','060','796','028','533','630','388','659','662','670','534','780','214','630','850','184','312','630','670','740','092','660','534','500','028','630','630',
          // Central America
          '084','188','222','320','340','484','558','591','092',
          // South America
          '032','068','076','152','170','218','238','328','600','604','740','858','862',
        ]);
        const ASIA_PAC = new Set([
          // East Asia
          '156','392','410','408','496','344','446','156',
          // South Asia
          '356','586','144','524','050','064','462',
          // Oceania & Pacific
          '036','554','242','090','548','598','016','184','258','296','316','520','540','548','585','598','876','882','772','776','798','826',
          // Central / West Asia often grouped in APAC (optional limited subset)
          '364','368','760','792','804','398','417','762','795','860','051','031','268','398','417'
        ]);

        const active = new Set(regions);
        const isGlobal = active.has('Global');

        countries.forEach(c => {
          const code = String(c.id).padStart(3,'0');
          const inEU = EU.has(code);
          const inSEA = SEA.has(code);
          const inAmericas = AMERICAS.has(code);
          const inAsiaPac = ASIA_PAC.has(code);
          let cls = 'country';
          // Determine if this country should be highlighted
          const highlight = isGlobal || (
            (inEU && active.has('EU')) ||
            (inSEA && active.has('SEA')) ||
            (inAmericas && active.has('Americas')) ||
            (inAsiaPac && active.has('Asia Pacific'))
          );
          if (highlight) {
            if (inSEA && (active.has('SEA') || isGlobal)) {
              cls = 'sea';
            } else if (inEU && (active.has('EU') || isGlobal)) {
              cls = 'eu';
            } else if (inAmericas && (active.has('Americas') || isGlobal)) {
              cls = 'americas';
            } else if (inAsiaPac && (active.has('Asia Pacific') || isGlobal)) {
              cls = 'asiapacific';
            } else if (isGlobal) {
              // Global coverage fallback (e.g., Africa & remaining Asia not in defined sets)
              cls = 'globalrest';
            }
          }
          const p = document.createElementNS('http://www.w3.org/2000/svg','path');
          p.setAttribute('d', path(c) || '');
          p.setAttribute('class', `wc-${cls}`);
          if (c.properties?.name) {
            p.setAttribute('aria-label', c.properties.name);
          }
          gCountries.appendChild(p);
        });

        // Borders
        const borderPath = document.createElementNS('http://www.w3.org/2000/svg','path');
        borderPath.setAttribute('d', path(borders) || '');
        borderPath.setAttribute('class','wc-borders');
        svg.appendChild(borderPath);

  // Legend intentionally removed per requirements
        if (!cancelled) setLoaded(true);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Map failed to load');
      }
    }

    draw();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 550"
        role="img"
        aria-label="World map with highlighted regions"
        className={`w-full h-full ${className}`}
        aria-hidden="true"
      />
      <style>{`
        /* Background mode assumes parent controls positioning & opacity */
        .wc-sphere { fill: #fafafa; }
        .wc-country { fill: #e5e7eb; stroke: #d1d5db; stroke-width: 0.3; }
        .wc-eu { fill: #2f7ed8; stroke: #ffffff; stroke-width: 0.3; }
        .wc-sea { fill: #f28e2b; stroke: #ffffff; stroke-width: 0.3; }
        .wc-americas { fill: #16a34a; stroke: #ffffff; stroke-width: 0.3; }
        .wc-asiapacific { fill: #0d9488; stroke: #ffffff; stroke-width: 0.3; }
        .wc-globalrest { fill: #14b8a6; stroke: #ffffff; stroke-width: 0.3; }
        .wc-borders { fill: none; stroke: #ffffff; stroke-width: 0.25; }
      `}</style>
      {!bare && !loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="text-xs text-neutral-500">Loading map…</span>
        </div>
      )}
      {error && !bare && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-red-600">{error}</span>
        </div>
      )}
    </>
  );
};

export default WorldCoverageMap;