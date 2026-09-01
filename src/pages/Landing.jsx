import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Product Management",
    description:
      "Create, organize, and manage your master product catalog from one central workspace.",
    icon: "▦",
  },
  {
    number: "02",
    title: "Lead Management",
    description:
      "Capture customer inquiries, assign leads to your team, and track every stage of the pipeline.",
    icon: "◎",
  },
  {
    number: "03",
    title: "Smart Quoting",
    description:
      "Generate customer-ready quotes using products, margins, installation costs, and additional charges.",
    icon: "◇",
  },
];

const roles = [
  {
    role: "Trader",
    description:
      "Build and maintain your master product catalog and make products available to vendors.",
    action: "Manage products",
  },
  {
    role: "Vendor",
    description:
      "Curate products, configure pricing, manage leads, and create customer quotations.",
    action: "Manage sales",
  },
  {
    role: "Sales Team",
    description:
      "Work on assigned leads, manage customer conversations, and generate quotes.",
    action: "Close deals",
  },
];

function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800/70">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          <Link
            to="/"
            className="text-2xl font-bold tracking-tight"
          >
            Lead<span className="text-indigo-400">MS</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#roles"
              className="transition hover:text-white"
            >
              Roles
            </a>

            <a
              href="#workflow"
              className="transition hover:text-white"
            >
              Workflow
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-indigo-400"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-5 pb-24 pt-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-32 lg:pt-32">

          {/* Hero copy */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Smarter sales management
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Manage leads.
              <br />
              Close deals.
              <br />
              <span className="text-indigo-400">
                Grow faster.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              LeadMS brings products, leads, sales teams, and
              customer quotations together in one powerful
              workspace.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold transition hover:bg-indigo-400"
              >
                Get started
                <span className="ml-2">→</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-900 hover:text-white"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
              <span>✓ Product management</span>
              <span>✓ Lead pipeline</span>
              <span>✓ Smart quotations</span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-indigo-500/5 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

              {/* Fake browser bar */}
              <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              </div>

              <div className="p-5 sm:p-6">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-indigo-400">
                      Overview
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Dashboard
                    </p>
                  </div>

                  <div className="h-8 w-8 rounded-full bg-indigo-500/15" />
                </div>

                {/* Preview stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ["Leads", "24"],
                    ["Quotes", "12"],
                    ["Revenue", "₹1.24L"],
                    ["Products", "48"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <p className="text-[10px] text-slate-500">
                        {label}
                      </p>

                      <p className="mt-2 text-lg font-bold">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pipeline preview */}
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">
                      Sales pipeline
                    </p>

                    <span className="text-[10px] text-slate-500">
                      This month
                    </span>
                  </div>

                  <div className="mt-5 flex items-end gap-2">
                    {[55, 72, 45, 85, 65, 92, 78].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-indigo-500/40"
                          style={{
                            height: `${height}px`,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-slate-800/70 bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-medium text-indigo-400">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your sales team needs.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
              From the first customer inquiry to the final
              quotation, LeadMS keeps your workflow organized.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-800 bg-slate-950/50 p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    {feature.icon}
                  </div>

                  <span className="text-xs text-slate-600">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section
        id="roles"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-indigo-400">
            One platform. Every role.
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Built around your team.
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
            Every role gets the tools and workflows they need
            without unnecessary complexity.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {roles.map((item, index) => (
            <article
              key={item.role}
              className={`rounded-2xl border p-7 ${
                index === 1
                  ? "border-indigo-500/30 bg-indigo-500/5"
                  : "border-slate-800 bg-slate-900/40"
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                0{index + 1}
              </p>

              <h3 className="mt-6 text-2xl font-bold">
                {item.role}
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {item.description}
              </p>

              <div className="mt-7 border-t border-slate-800 pt-5 text-sm font-medium text-indigo-400">
                {item.action} →
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        className="border-y border-slate-800/70 bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">

          <div className="text-center">
            <p className="text-sm font-medium text-indigo-400">
              Simple workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From inquiry to deal.
            </h2>
          </div>

          <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
            {[
              ["01", "Capture", "Create a customer lead."],
              ["02", "Connect", "Contact and qualify the lead."],
              ["03", "Quote", "Build a customized quote."],
              ["04", "Close", "Accept or reject the deal."],
            ].map(([number, title, description], index) => (
              <div
                key={number}
                className="flex w-full items-center md:w-auto"
              >
                <div className="text-center md:w-40">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                    {number}
                  </div>

                  <h3 className="mt-4 font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {description}
                  </p>
                </div>

                {index < 3 && (
                  <div className="mx-4 hidden h-px w-12 bg-slate-800 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center sm:px-8">
          <p className="text-sm font-medium text-indigo-400">
            Ready to get started?
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Simplify your sales workflow.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Bring your products, leads, team, and quotations
            together with LeadMS.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-semibold transition hover:bg-indigo-400"
          >
            Create your account
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © 2026 LeadMS. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              to="/login"
              className="transition hover:text-slate-300"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="transition hover:text-slate-300"
            >
              Get started
            </Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

export default Landing;