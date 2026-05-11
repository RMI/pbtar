import React from "react";

type UpdateTag = "Coverage" | "Functionality" | "Methodology" | "Insights";

type UpdatePost = {
  title: string;
  date: string;
  tags: UpdateTag[];
  body: React.ReactNode;
};

const categories: Array<{
  tag: UpdateTag;
  description: string;
}> = [
  {
    tag: "Coverage",
    description:
      "Information on which pathways, sectors, and regions you can find in the TPR.",
  },
  {
    tag: "Functionality",
    description: "Improvements of the features and tools available in the TPR.",
  },
  {
    tag: "Methodology",
    description:
      "Information on how pathways are assessed and presented in the TPR.",
  },
  {
    tag: "Insights",
    description:
      "Updates, case studies, and stories highlighting how the TPR can be leveraged in real life analyses.",
  },
];

const tagClassNames: Record<UpdateTag, string> = {
  Coverage: "border border-sky-200 bg-sky-50 text-sky-800",
  Functionality: "border border-amber-200 bg-amber-50 text-amber-800",
  Methodology: "border border-violet-200 bg-violet-50 text-violet-800",
  Insights: "border border-emerald-200 bg-emerald-50 text-emerald-800",
};

const posts: UpdatePost[] = [
  // Add new posts at the top so the latest update appears first.
  // Example:
  // {
  //   title: "Power sector coverage expanded for Southeast Asia",
  //   date: "May 7, 2026",
  //   tags: ["Coverage", "Insights"],
  //   body: (
  //     <>
  //       <p>
  //         We added new pathway coverage for additional Southeast Asian
  //         markets and refreshed several pathway summaries.
  //       </p>
  //       <p>
  //         This update makes it easier to compare regional and country-level
  //         pathways for transition assessments.
  //       </p>
  //     </>
  //   ),
  // },
  {
    title:
      "Introducing the Transition Pathways Repository: Making Transition Analysis Actionable",
    date: "March 30, 2026",
    tags: ["Functionality", "Coverage"],
    body: (
      <>
        <p>
          On December 11, 2025, RMI’s Climate Finance team launched the pilot
          version of the Transition Pathways Repository (TPR) – An online tool
          designed to bring clarity and efficiency to corporate transition
          analysis by making accessible in a single place more than 50
          transition pathways.
        </p>
        <p>
          During our launch webinar, we explored the evolving landscape of
          corporate transition analyses and discussed how transition plan
          assessments can inform other internal teams within financial
          institutions, strengthening metrics used across risk, strategy, and
          front office functions.
        </p>
        <p>
          To deliver real value, transition analyses, including transition plan
          credibility assessments, must go beyond high-level narratives. They
          need to be granular, forward-looking, and generate metrics that are
          decision-useful for existing risk and front office workflows.
        </p>
        <p>
          But even the most sophisticated metrics are only meaningful when
          properly contextualized. This means that financial institutions need
          to understand which transition pathways and scenarios exist, what use
          cases they support, and what the underlying assumptions mean. This can
          be time-consuming and resource- intensive.
          <b>
            The TPR helps financial institutions navigate the vast field of
            transition pathways, making it easier and faster to identify
            relevant benchmarks for assessing transitioning companies.
          </b>
        </p>
        <p>
          Watch the{" "}
          <a
            href="https://www.youtube.com/watch?v=Xq730bspPh4"
            className="text-energy-700 underline underline-offset-2 hover:text-energy-800"
          >
            <b>recording of our launch webinar</b>
          </a>
          .
        </p>
        <p>
          The pilot version focuses on the power sector in Southeast Asia,
          offering a first look at the platform’s capabilities. But stay tuned
          for updates on new features and expanded regional and sectoral
          coverage very soon.
        </p>
      </>
    ),
  },
];

const ResourcesUpdatesPage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <section className="relative overflow-hidden rounded-[1.75rem] bg-rmiblue-800 px-6 py-8 text-white shadow-lg md:px-10 md:py-11">
          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-energy-700/10" />
          <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-white/7 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-energy-500/8 blur-2xl" />

          <div className="relative max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Updates
            </h1>

            <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-white/95 md:text-2xl">
              Check out the latest from our team on the Transition Pathways
              Repository (TPR) and its use cases.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-rmigray-800">
              Categories
            </h2>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <div
                key={category.tag}
                className="rounded-2xl border border-neutral-200 bg-neutral-100/80 p-4 shadow-sm"
              >
                <span
                  className={
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
                    tagClassNames[category.tag]
                  }
                >
                  {category.tag}
                </span>
                <p className="mt-3 text-sm leading-7 text-rmigray-700">
                  {category.description}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-rmigray-800 mt-8">
              Latest updates
            </h2>
          </div>

          {posts.length > 0 ? (
            <div className="mt-8 space-y-6">
              {posts.map((post) => (
                <article
                  key={`${post.date}-${post.title}`}
                  className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-rmigray-800">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-rmigray-500">
                        {post.date}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={`${post.title}-${tag}`}
                          className={
                            "rounded-full px-3 py-1 text-sm font-semibold " +
                            tagClassNames[tag]
                          }
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 text-rmigray-700 leading-7">
                    {post.body}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
              <p className="text-rmigray-700 leading-7">
                No posts have been added yet. When you are ready, add a new
                entry to the `posts` array at the top of this file.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResourcesUpdatesPage;
