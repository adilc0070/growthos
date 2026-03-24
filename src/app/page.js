const objectives = [
  "Stop lead leakage",
  "Increase conversion rate",
  "Improve student success",
  "Generate social proof automatically",
  "Build a scalable revenue system",
];

const modules = [
  {
    title: "Lead Management (CRM)",
    summary:
      "Pipeline, statuses, filters, timeline, notes, reminders — plus capture and import when we wire integrations.",
    accent: "border-l-emerald-500",
    dot: "bg-emerald-500",
  },
  {
    title: "Sales System",
    summary:
      "Scripts, WhatsApp shortcuts, follow-ups, objection templates, and per-lead sales history.",
    accent: "border-l-amber-500",
    dot: "bg-amber-500",
  },
  {
    title: "Student Success",
    summary:
      "Enrolments, tasks, progress, submissions, check-ins, and community hooks.",
    accent: "border-l-sky-500",
    dot: "bg-sky-500",
  },
  {
    title: "Proof Engine",
    summary:
      "Testimonials, tagging, case studies, and content templates for marketing.",
    accent: "border-l-violet-500",
    dot: "bg-violet-500",
  },
  {
    title: "Lead Quality & Targeting",
    summary:
      "Scoring, qualification, personas, and hot/warm/cold segmentation.",
    accent: "border-l-orange-500",
    dot: "bg-orange-500",
  },
  {
    title: "Scaling Engine",
    summary:
      "Referrals, upsells, funnel tracking, and revenue views as we grow.",
    accent: "border-l-rose-500",
    dot: "bg-rose-500",
  },
];

const flowSteps = [
  "Leads",
  "CRM",
  "Sales",
  "Conversion",
  "Student success",
  "Results",
  "Proof",
  "Better leads",
  "Scale",
];

const roadmap = [
  { week: "Week 1", items: ["Lead CRUD", "Pipeline (Kanban)", "Basic dashboard"] },
  { week: "Week 2", items: ["Follow-up system", "Lead timeline", "Status updates"] },
  { week: "Week 3", items: ["Student module (basic)", "Task tracking"] },
  { week: "Week 4", items: ["Testimonials module", "Simple analytics"] },
];

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-sm text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight">GrowthOS</span>
            <span className="rounded-full border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-200">
              Internal
            </span>
          </div>
          <nav
            className="hidden items-center gap-6 sm:flex"
            aria-label="On this page"
          >
            <NavLink href="#objectives">Objectives</NavLink>
            <NavLink href="#flow">Flow</NavLink>
            <NavLink href="#modules">Modules</NavLink>
            <NavLink href="#roadmap">MVP</NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-20 px-4 py-14 sm:px-6 sm:py-20">
        <section className="space-y-6" aria-labelledby="hero-heading">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Course business operating system
          </p>
          <h1
            id="hero-heading"
            className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl sm:leading-tight"
          >
            One place for leads, sales, students, proof, and scaling.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
            This build is for our team — not a public marketing site. Use it as the
            home base while we ship the MVP: CRM first, then follow-ups, students,
            and testimonials.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/leads"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            >
              Open Lead CRM
            </a>
            <a
              href="#modules"
              className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
            >
              Explore modules
            </a>
          </div>
        </section>

        <section
          id="objectives"
          className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8"
          aria-labelledby="objectives-heading"
        >
          <h2
            id="objectives-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Core objectives
          </h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            What we are optimizing for as we build.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {objectives.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg bg-stone-50 px-3 py-2.5 dark:bg-stone-950/50"
              >
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500"
                  aria-hidden
                />
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="flow"
          className="scroll-mt-24"
          aria-labelledby="flow-heading"
        >
          <h2
            id="flow-heading"
            className="text-lg font-semibold tracking-tight"
          >
            System flow
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
            End-to-end loop: from first touch to proof that feeds better leads.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 sm:p-6">
            <ol className="flex min-w-max items-center gap-2 text-sm sm:gap-3">
              {flowSteps.map((step, i) => (
                <li key={step} className="flex items-center gap-2 sm:gap-3">
                  <span className="whitespace-nowrap rounded-md bg-stone-100 px-2.5 py-1 font-medium text-stone-800 dark:bg-stone-800 dark:text-stone-100">
                    {step}
                  </span>
                  {i < flowSteps.length - 1 && (
                    <span
                      className="text-stone-400 dark:text-stone-600"
                      aria-hidden
                    >
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="modules"
          className="scroll-mt-24"
          aria-labelledby="modules-heading"
        >
          <h2
            id="modules-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Product modules
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
            Rough scope from the internal plan — implementation order follows the MVP
            weeks below.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {modules.map((m) => (
              <li
                key={m.title}
                className={`rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 ${m.accent} border-l-4`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${m.dot}`}
                    aria-hidden
                  />
                  <h3 className="font-semibold tracking-tight">{m.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                  {m.summary}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="roadmap"
          className="scroll-mt-24"
          aria-labelledby="roadmap-heading"
        >
          <h2
            id="roadmap-heading"
            className="text-lg font-semibold tracking-tight"
          >
            MVP execution plan
          </h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Four-week slice from the plan — adjust dates as needed.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {roadmap.map((block) => (
              <article
                key={block.week}
                className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
              >
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-400">
                  {block.week}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-stone-600 dark:text-stone-400">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-emerald-600 dark:text-emerald-500" aria-hidden>
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          className="rounded-2xl border border-dashed border-stone-300 bg-stone-100/50 p-6 dark:border-stone-700 dark:bg-stone-900/40 sm:p-8"
          aria-labelledby="stack-heading"
        >
          <h2 id="stack-heading" className="text-lg font-semibold tracking-tight">
            Stack (reference)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            Next.js App Router, Tailwind, server actions / API routes, MongoDB,
            NextAuth — plus WhatsApp, automation, and payments when we integrate.
          </p>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-8 dark:border-stone-800">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-stone-500 dark:text-stone-500 sm:px-6">
          GrowthOS — internal team hub. Not for external distribution.
        </div>
      </footer>
    </div>
  );
}
