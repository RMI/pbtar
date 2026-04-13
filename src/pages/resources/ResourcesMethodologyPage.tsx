import React, { useId, useState } from "react";
import { Link } from "react-router-dom";

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
  return (
    <div className="rounded-lg bg-white shadow p-6">
      <h3 className="text-lg font-semibold text-rmigray-800 mb-2">{title}</h3>
      <div className="text-rmigray-700">{children}</div>
    </div>
  );
};

const TextBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="rounded-lg bg-white shadow p-6 text-rmigray-700">
      {children}
    </div>
  );
};

const CollapsibleSubsection: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className={className ?? "mt-10 max-w-5xl"}>
      <h3 className="text-lg font-semibold text-rmigray-800">
        <button
          type="button"
          className="w-full flex items-center justify-between gap-4 py-2 text-left hover:text-rmiblue-800 transition-colors"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span>{title}</span>
          <span
            className={
              "text-rmigray-500 transition-transform " +
              (isOpen ? "rotate-180" : "rotate-0")
            }
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
      </h3>
      {isOpen && (
        <div
          id={contentId}
          className="mt-4"
        >
          {children}
        </div>
      )}
    </div>
  );
};

const ResourcesMethodologyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Methodology</h1>

      <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
        How the Transition Pathways Repository (TPR) classifies pathways and how
        to interpret those classifications
      </h2>
      <p className="text-rmigray-700 max-w-4xl">
        The TPR uses a structured classification approach to help analysts
        compare pathways in a consistent manner.
      </p>
      <p className="text-rmigray-700 max-w-4xl">
        These classifications are designed to support pathway selection and
        interpretation for use cases such as client transition assessments, risk
        analyses, and identification of opportunities. They do not determine a
        single “best” pathway for a task - the analyst must still understand the
        underlying pathway. The relevance of a pathway in a real application
        still depends on the analyst understanding what they are looking for and
        why.
      </p>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Core definitions
        </h2>
        <p className="text-rmigray-700 max-w-4xl">
          Throughout the TPR, you will see the use of closely related
          terminology when describing pathways and their content. This is a
          brief overview of what each of these terms refers to.
        </p>
        <div className="mt-6 max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="rounded-lg bg-white shadow p-6 lg:col-span-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
                  Transition pathway
                </h3>
                <div className="text-rmigray-700">
                  <p>
                    A forward-looking view of how a sector, region, or economy
                    could change over time.
                  </p>
                  <p className="mt-3">
                    This covers anything from detailed models to simple policy
                    targets.
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
                  Scenario
                </h3>
                <div className="text-rmigray-700">
                  <p>A subset of pathways based on systematic modeling.</p>
                  <p className="mt-3">
                    Scenarios often provide a structured set of assumptions.
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
                  Benchmark
                </h3>
                <div className="text-rmigray-700">
                  <p>
                    A data point from a pathway that can be compared with
                    company data.
                  </p>
                  <p className="mt-3">
                    Pathways often provide multiple relevant benchmarks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-neutral-100 p-6 text-rmigray-700 border border-neutral-200 lg:col-span-4 self-start">
            <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
              Important
            </h2>
            <p>Classifications support comparison, not automatic selection.</p>
            <p className="mt-3">
              The TPR classifications are meant to make comparison easier and
              more transparent. They help analysts understand what a pathway can
              and cannot tell them, but they do not replace analyst judgment.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
          Classification group 1: Pathway features
        </h2>
        <p className="text-rmigray-700 max-w-5xl">
          Pathways usually exhibit several features that contain meta data and
          narrative assumptions. These are useful to understand the idea behind
          a pathway or scenario and the broad implications of the modelled
          changes.
        </p>

        <CollapsibleSubsection
          title="Pathway type"
          className="mt-6 max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Predictive">
              <p>
                Predictive pathways begin with assumptions considered probable
                by the developer and project likely future outcomes.
              </p>
              <p className="mt-3">
                These are often useful for assessing risk and feasibility.
              </p>
            </InfoCard>

            <InfoCard title="Exploratory">
              <p>
                Exploratory pathways test the impact of different assumptions
                that are plausible but not necessarily predicted.
              </p>
              <p className="mt-3">
                These are often useful for assessing risks and opportunities
                under alternative policy, market, or technology conditions.
              </p>
            </InfoCard>

            <InfoCard title="Normative">
              <p>
                Normative pathways begin with a target end state, often a
                climate outcome such as 1.5°C, and work backward to produce a
                pathway consistent with that goal.
              </p>
              <p className="mt-3">
                These are often useful for ambition and alignment questions.
              </p>
            </InfoCard>
          </div>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Temperature outcome">
          <TextBox>
            <p>
              Where available, temperature outcome acts as a proxy for pathway
              ambition. It refers to the °C global heating above pre-industrial
              levels by the end of the century, disregarding potentially higher
              peak increases before that.
            </p>
            <p className="mt-3">
              Global pathways often provide a temperature outcome as they can be
              linked to a carbon budget. Regional or sector-specific pathways
              usually do not have a clear temperature outcome because a global
              model is required to calculate it.
            </p>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Start year of model">
          <TextBox>
            <p>
              The start year of the model refers to the last year before any
              forward-looking modelling. It is the final year of the historical
              baseline used in the calculations of the pathway.
            </p>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="End year of model">
          <TextBox>
            <p>
              The end year of the model refers to the final year of the
              forward-looking output generated by the model, focusing on the
              available pathway metrics as a reference.
            </p>
            <p className="mt-3">
              For example, if the pathway metrics are available until 2050, but
              there is a temperature outcome for 2100, then the end year is
              2050.
            </p>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Net zero reached">
          <TextBox>
            <p>
              The year in which the pathway reaches net zero emissions. Not all
              pathways reach net zero emissions, so this value will not always
              be provided.
            </p>
            <p className="mt-3">
              In some cases, net zero will refer to a specific region or (set
              of) sector(s). Where this is the case, the scope is indicated
              accordingly.
            </p>
          </TextBox>
        </CollapsibleSubsection>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
          Classification group 2: Scope, Granularity, Availability
        </h2>
        <p className="text-rmigray-700 max-w-5xl">
          In corporate transition assessments, company metrics are compared with
          benchmarks from pathways. To ensure this is a fair comparison, it is
          important that the scope, granularity, and data availability of the
          benchmark data in the pathway matches those of the company (or that
          any deviations can be approximated transparently).
        </p>
        <p className="text-rmigray-700 max-w-5xl">
          This matters because a pathway can appear relevant at a high level but
          still be too coarse for the intended application.
        </p>

        <CollapsibleSubsection title="Regions">
          <TextBox>
            <p>
              The list of regions and countries covered by the pathway. This
              will only list countries or regions that the pathway provides
              benchmark metrics for. All individual countries are allowed, based
              on ISO2 (3166) definitions. Regions are provided as defined in the
              pathway.
            </p>
            <p className="mt-3">
              NOTE: RMI does not make any statements on country delineations
              and/or conflicting territorial claims.
            </p>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Sectors">
          <TextBox>
            <p>
              List of economic sectors that the pathway covers, where coverage
              means that the pathway provides at least one relevant output
              metric for each of the sectors assigned here.
            </p>
            <p className="mt-3">
              NOTE: The repository is currently limited to providing detailed
              information on the power sector. Additional sectors will be added
              in the near future. This variable also clarifies which other sectors
              a pathway models.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Power</li>
              {/* <li>Steel,</li>
              <li>Power,</li>
              <li>Aviation.</li> */}
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Sector segments">
          <TextBox>
            <p>
              List of segments of sectors that the pathway covers. This refers
              to the segments of a sector that are used on modelling the pathway
              results. Sector specific metrics will additionally show the
              segments that they refer to, which may be a subset of the full
              sector metrics covered.
            </p>
            <p className="mt-3">
              For example, a pathway may describe which input fuels are used in
              the power sector and as such it covers “Upstream input fuels and
              materials”. However, for the “Emissions intensity” benchmark
              metric, it will only cover the “Power generation (on-grid)”
              segment of the sector.
            </p>
            <p className="mt-3">
              Sector segments are only defined for the sectors that are covered
              in detail, and the allowed values are listed below.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>
                Power: Upstream input fuels and materials, Power generation
                (on-grid), Captive power generation (behind-the-meter), Power
                storage, Power grid (transmission and distribution, grid
                connection).
              </li>
              {/* <li>
                Aviation: Fuel production, Fuel system logistics, Fleet
                transition, Fleet operation (Passenger), Fleet operation
                (Freight), Airport and airspace system,
              </li>
              <li>
                Steel: Iron mining, Fuel procurement, Iron reduction, Steel
                making and casting, Steel product shaping, Finished product
                manufacturing.
              </li> */}
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Technologies">
          <TextBox>
            <p>
              This field shows the technologies that a pathway provides output
              for within the sector(s) that it covers. It is returned for any
              sector that is identified as in-scope in the “sectors” variable
              and that has specified allowed values here. As the sector coverage
              of the TPR expands, sectors which we show technologies for will
              also expand.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>
                Power: Coal, Oil, Gas, Nuclear, Hydro, Wind, Solar, Biomass,
                Renewables, Other.
              </li>
              {/* <li>
                Aviation: JET A, SAF, Electricity (for battery-electric
                aircraft), Hydrogen (for hydrogen aircraft), HEFA (Biofuels,
                incl. FT with biomass), PtL (incl. G/FT), AtJ, Other,
              </li>
              <li>
                Steel: BOF, BF-BOF, BF-BOF + PCI, BF-BOF + CCUS, EAF, DRI-EAF
                (normal incl. CH4), DRI-EAF + H2, DRI-EAF + CCS, Scrap-EAF,
                Electrolyser/Electrowinning, Other.
              </li> */}
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Metrics">
          <TextBox>
            <p>
              List of sector-specific benchmark metrics that the pathway reports
              outcomes for. Currently, this is only defined for the power
              sector, but it will be expanded to each additional sector that we
              fully cover in the repository.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>
                Power: Emissions intensity, Absolute emissions, Capacity,
                Generation, Technology mix, Storage capacity.
              </li>
              {/* <li>
                Aviation: Emissions intensity (passenger), Emissions intensity
                (freight), Absolute emissions Well-to-Wheel (passenger),
                Absolute emissions Well-to-Wheel (freight), Total Demand
                (passenger), Total Demand (freight), Demand by propulsion
                technology (passenger), Demand by propulsion technology
                (freight), Demand share by propulsion technology (passenger),
                Demand share by propulsion technology (freight),
              </li>
              <li>
                Steel: Emissions intensity (total), Emissions intensity
                (primary), Emissions intensity (secondary), Absolute emissions,
                Emissions intensity by production route, Technology mix
                (capacity by route), Steel production by technology (production
                route), Scrap share.
              </li> */}
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Emissions scope">
          <TextBox>
            <p>
              Describes which GHGs are considered in scope in the pathway’s
              emissions results. This means that this refers to absolute
              emissions and emissions intensity metrics.
            </p>
            <p className="mt-3">
              Where the scope of GHGs covered differs from the entity the
              benchmark data is supposed to be compared to (e.g. the emissions
              reported by a company), the analyst may have to consider making
              additional calculations or assumptions to be able to use the
              pathway, or use another pathway with matching the emissions scope.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>CO2,</li>
              <li>CO2e (Kyoto),</li>
              <li>CO2e (CO2, Methane),</li>
              <li>CO2e (unspecified GHGs),</li>
              <li>Other emissions scope,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Policy types">
          <TextBox>
            <p>
              Lists which types of policies the pathway models. Refers only to
              the instruments, not their ambitiousness.
            </p>
            <p className="mt-3">
              This information is particularly relevant when analyzing the
              potential impacts of a company’s exposure to policies in the
              region they operate in.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Carbon price,</li>
              <li>Phaseout dates,</li>
              <li>Subsidies,</li>
              <li>Target technology shares,</li>
              <li>Feed-in tariffs,</li>
              <li>Performance standards,</li>
              <li>Other.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="New technologies included">
          <TextBox>
            <p>
              A list of the main new technologies covered by the pathway that
              are not scaling yet, but that will play a role in the future. The
              included technologies do not necessarily come with a detailed
              timeseries.
            </p>
            <p className="mt-3">
              Analysts can use this as a proxy for how optimistic the pathway is
              regarding technological breakthroughs. This can be useful both as
              a first steps in technology risk analysis as well as in
              opportunity identification.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>No new technologies,</li>
              <li>CCUS,</li>
              <li>DAC,</li>
              <li>Green H2/ammonia,</li>
              <li>SAF,</li>
              <li>Battery storage,</li>
              <li>EGS/AGS,</li>
              <li>Other new technologies,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Technology costs detail">
          <TextBox>
            <p>
              Describes the level of granularity that is available for
              technology unit cost data.
            </p>
            <p className="mt-3">
              A more granular breakdown can be useful when a company’s future
              profitability and competitiveness is to be analyzed, especially in
              technologies whose costs are projected to decrease over time.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Total costs,</li>
              <li>Capital costs, O&M, etc.,</li>
              <li>Other cost breakdown,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Investment needs">
          <TextBox>
            <p>
              Describes the availability and granularity of the investment needs
              data provided by the pathway.
            </p>
            <p className="mt-3">
              This can be an indication if the investment pipeline of a company
              is on pace with assumed requirements of the pathway. Where more
              detail is provided, it can also highlight, what part of the value
              chain needs most investment and if that is reflected in a
              company’s strategy.
            </p>
            <p>
              Note: It is usually not possible to fully derive investment
              requirements based on unit costs and capacity growth numbers by
              sector and technology. This is because capacity numbers do not
              show how much investment goes into maintenance and
              infrastructure-related projects.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Total investment,</li>
              <li>By sector,</li>
              <li>By sector, part of value chain,</li>
              <li>By technology,</li>
              <li>By technology, part of value chain,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
          Classification group 3: Trends, Assumptions, Narrative
        </h2>
        <p className="text-rmigray-700 max-w-5xl">
          Each pathway will describe trends that are built on assumptions of how
          the future will unfold. These, together, paint a relatively full
          picture of the pathway narrative. Different types of corporate
          transition assessment use cases usually work with different types of
          narratives, which is why it is crucial to have a good grasp of the
          pathways assumptions and trends when selecting pathways for an
          analysis.
        </p>

        <CollapsibleSubsection title="Emissions trajectory">
          <TextBox>
            <p>
              Summarizes how GHG emissions develop in the pathway between the
              start year of the model and the end year of the model.
            </p>
            <p className="mt-3">
              The underlying calculation is made using the compound annual
              growth rate.
            </p>
            <p className="mt-3">
              Comes with an indication of regional and sectoral scope.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Significant increase,</li>
              <li>Moderate increase,</li>
              <li>Minor increase,</li>
              <li>Low or no change,</li>
              <li>Minor decrease,</li>
              <li>Moderate decrease,</li>
              <li>Significant decrease,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Energy efficiency">
          <TextBox>
            <p>
              Summarizes how energy efficiency, defined as energy use per USD
              GDP output, develops in the pathway between the start year of the
              model and the end year of the model.
            </p>
            <p className="mt-3">
              The underlying calculation is made using the compound annual
              growth rate.
            </p>
            <p className="mt-3">
              Comes with an indication of regional and sectoral scope.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Significant deterioration,</li>
              <li>Moderate deterioration,</li>
              <li>Minor deterioration,</li>
              <li>Low or no change,</li>
              <li>Minor improvement,</li>
              <li>Moderate improvement,</li>
              <li>Significant improvement,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Energy demand">
          <TextBox>
            <p>
              Summarizes how energy demand develops in the pathway between the
              start year of the model and the end year of the model.
            </p>
            <p className="mt-3">
              The underlying calculation is made using the compound annual
              growth rate.
            </p>
            <p className="mt-3">
              Comes with an indication of regional and sectoral scope.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Significant increase,</li>
              <li>Moderate increase,</li>
              <li>Minor increase,</li>
              <li>Low or no change,</li>
              <li>Minor decrease,</li>
              <li>Moderate decrease,</li>
              <li>Significant decrease,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Electrification">
          <TextBox>
            <p>
              Summarizes how the share of electricity in energy end use develops
              in the pathway between the start year of the model and the end
              year of the model.
            </p>
            <p className="mt-3">
              The underlying calculation is made using the compound annual
              growth rate.
            </p>
            <p className="mt-3">
              Comes with an indication of regional and sectoral scope.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Significant increase,</li>
              <li>Moderate increase,</li>
              <li>Minor increase,</li>
              <li>Low or no change,</li>
              <li>Minor decrease,</li>
              <li>Moderate decrease,</li>
              <li>Significant decrease,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Policy ambition">
          <TextBox>
            <p>
              Describes the level of ambition of the policies modelled in the
              pathway. This is a key differentiator for many pathways and higher
              policy ambition is often considered to be harder to achieve.
            </p>
            <p className="mt-3">
              From a risk angle, ambition closer to “current/legislated” is more
              likely to occur, but not the only plausible future outcome. Higher
              ambition pathways often come with remaining implementation gaps,
              which means they can be a good basis to understand bottlenecks for
              the transition of a sector. These, in turn, can be opportunities
              in some cases, or indicators where policymakers could intervene.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>No policies included,</li>
              <li>Current/legislated policies,</li>
              <li>Current and drafted policies,</li>
              <li>NDCs, unbconditional only,</li>
              <li>NDCs incl conditional targets,</li>
              <li>High-ambition policies,</li>
              <li>Other policy ambition,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>

        <CollapsibleSubsection title="Technology cost trend">
          <TextBox>
            <p>
              Describes the direction of unit costs of the low-carbon
              technologies of in-scope sectors. This shows if newer low-carbon
              technologies become more competitive compared to their high-carbon
              counterparts.
            </p>
            <p className="mt-3">
              Analysts may be interested in how fast costs of individual
              technologies are assumed to change. Technology costs play a key
              role in determining if a company moves too fast or too slow to
              capture the benefits of sectoral change.
            </p>
            <p className="mt-3">The list of allowed values is:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>Increase,</li>
              <li>Low or no change,</li>
              <li>Decrease,</li>
              <li>No information.</li>
            </ul>
          </TextBox>
        </CollapsibleSubsection>
      </div>

      <div className="mt-10 max-w-5xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Important
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-rmigray-800">
              Multiple pathways can complement each other
            </h3>
            <p className="mt-2">
              Different pathways can help answer different parts of the same
              assessment question.
            </p>
            <p className="mt-2">
              For example, one pathway may be useful for ambition and another
              for regional policy risk.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-5xl">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Expert overview
        </h2>
        <div className="mt-4">
          <TextBox>
            <p>
              The Expert Overview is a written summary that describes the
              developer behind the pathway and their affiliations, the main
              narrative of the pathway, the core drivers that are assumed to be
              behind the sectoral transition, the key trends that the pathway
              produces, the main external dependencies, and what types of
              assessments the pathway is or is not well suited for.
            </p>
          </TextBox>
        </div>
      </div>

      <div className="mt-10 max-w-5xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Looking for practical guidance?
        </h2>
        <p>
          Visit{" "}
          <Link
            to="/resources/how-to-use-this-tool"
            className="text-energy-700 hover:text-energy-800 underline underline-offset-2 font-semibold"
          >
            How to Use this Tool
          </Link>{" "}
          for a simpler, step-by-step guide to applying these classifications in
          TPR.
        </p>
      </div>
    </div>
  );
};

export default ResourcesMethodologyPage;
