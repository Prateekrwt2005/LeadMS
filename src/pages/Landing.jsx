import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

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

const workflow = [
  ["01", "Capture", "Create a customer lead."],
  ["02", "Connect", "Contact and qualify the lead."],
  ["03", "Quote", "Build a customized quote."],
  ["04", "Close", "Accept or reject the deal."],
];

/* =========================================================
   LAZY REVEAL COMPONENT
========================================================= */

function Reveal({
  children,
  className = "",
  delay = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Landing() {
  /* =========================================================
     SMOOTH NAVIGATION
  ========================================================= */

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (!element) return;

    const navbarOffset = 80;

    const elementPosition =
      element.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <Link
            to="/"
            className="group text-2xl font-bold tracking-tight"
          >
            Lead
            <span className="text-neutral-300 transition group-hover:text-white">
              MS
            </span>
          </Link>

          {/* Navigation */}

          <nav className="hidden items-center gap-8 text-sm text-neutral-500 md:flex">

            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="transition hover:text-white"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("roles")}
              className="transition hover:text-white"
            >
              Roles
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("workflow")}
              className="transition hover:text-white"
            >
              Workflow
            </button>

          </nav>

          {/* Actions */}

          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-400 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Get started
            </Link>

          </div>

        </div>

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative">

        {/* Background glow */}

        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[650px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[140px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-14">

          {/* =================================================
              HERO LEFT
          ================================================= */}

          <Reveal>

            <div>

              {/* Badge */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-3.5 py-1.5 text-xs font-medium text-neutral-300">

                <span className="h-1.5 w-1.5 rounded-full bg-white" />

                Smarter sales management

              </div>

              {/* Heading */}

              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">

                Manage leads.
                <br />

                Close deals.
                <br />

                <span className="text-neutral-500">
                  Grow faster.
                </span>

              </h1>

              {/* Description */}

              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
                LeadMS brings products, leads, sales teams, and
                customer quotations together in one powerful
                workspace.
              </p>

              {/* Buttons */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Get started

                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>

                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.02] px-6 py-3.5 text-sm font-semibold text-neutral-300 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                >
                  Sign in
                </Link>

              </div>

              {/* Features */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-neutral-600">

                <span>✓ Product management</span>

                <span>✓ Lead pipeline</span>

                <span>✓ Smart quotations</span>

              </div>

            </div>

          </Reveal>

          {/* =================================================
              DASHBOARD PREVIEW
          ================================================= */}

          <Reveal
            delay={120}
            className="relative"
          >

            <div className="absolute -inset-6 rounded-[2rem] bg-white/[0.025] blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-[#090909] shadow-2xl">

              {/* Browser bar */}

              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />

                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />

                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />

                </div>

                <span className="text-[10px] text-neutral-600">
                  app.leadms.com
                </span>

              </div>

              <div className="p-5 sm:p-6">

                {/* Dashboard header */}

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-widest text-neutral-600">
                      Overview
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Dashboard
                    </p>

                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs">
                    U
                  </div>

                </div>

                {/* Stats */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  {[
                    ["Leads", "24"],
                    ["Quotes", "12"],
                    ["Revenue", "₹1.24L"],
                    ["Products", "48"],
                  ].map(([label, value], index) => (

                    <Reveal
                      key={label}
                      delay={180 + index * 70}
                    >

                      <div className="rounded-xl border border-white/[0.08] bg-black p-4 transition hover:border-white/[0.18]">

                        <p className="text-[10px] uppercase tracking-wider text-neutral-600">
                          {label}
                        </p>

                        <p className="mt-2 text-lg font-semibold">
                          {value}
                        </p>

                      </div>

                    </Reveal>

                  ))}

                </div>

                {/* Pipeline */}

                <div className="mt-4 rounded-xl border border-white/[0.08] bg-black p-4">

                  <div className="flex items-center justify-between">

                    <p className="text-xs font-medium">
                      Sales pipeline
                    </p>

                    <span className="text-[10px] text-neutral-600">
                      This month
                    </span>

                  </div>

                  <div className="mt-5 flex h-24 items-end gap-2">

                    {[55, 72, 45, 85, 65, 92, 78].map(
                      (height, index) => (

                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-white/[0.18] transition-all duration-500 hover:bg-white/[0.35]"
                          style={{
                            height: `${height}%`,
                          }}
                        />

                      )
                    )}

                  </div>

                </div>

                {/* Performance */}

                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">

                  <div>

                    <p className="text-xs font-medium">
                      Pipeline performance
                    </p>

                    <p className="mt-1 text-[10px] text-neutral-600">
                      Compared with last month
                    </p>

                  </div>

                  <span className="text-xs font-semibold">
                    +18.4%
                  </span>

                </div>

              </div>

            </div>

          </Reveal>

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="scroll-mt-20 border-y border-white/[0.06]"
      >

        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">

          <Reveal>

            <div className="max-w-2xl">

              <p className="text-sm font-medium text-neutral-400">
                Everything in one place
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Everything your sales team needs.
              </h2>

              <p className="mt-4 text-sm leading-6 text-neutral-500 sm:text-base">
                From the first customer inquiry to the final
                quotation, LeadMS keeps your workflow organized.
              </p>

            </div>

          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {features.map((feature, index) => (

              <Reveal
                key={feature.number}
                delay={index * 100}
              >

                <article className="group h-full rounded-2xl border border-white/[0.08] bg-[#080808] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.18] hover:bg-[#0c0c0c]">

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-lg text-white">
                      {feature.icon}
                    </div>

                    <span className="text-xs text-neutral-700">
                      {feature.number}
                    </span>

                  </div>

                  <h3 className="mt-7 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {feature.description}
                  </p>

                  <div className="mt-7 h-px bg-white/[0.06]" />

                  <div className="mt-4 text-xs font-medium text-neutral-600 transition group-hover:text-neutral-300">
                    Explore feature →
                  </div>

                </article>

              </Reveal>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          ROLES
      ===================================================== */}

      <section
        id="roles"
        className="scroll-mt-20 mx-auto max-w-7xl px-5 py-24 sm:px-8"
      >

        <Reveal>

          <div className="max-w-2xl">

            <p className="text-sm font-medium text-neutral-400">
              One platform. Every role.
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Built around your team.
            </h2>

            <p className="mt-4 text-sm leading-6 text-neutral-500 sm:text-base">
              Every role gets the tools and workflows they need
              without unnecessary complexity.
            </p>

          </div>

        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          {roles.map((item, index) => (

            <Reveal
              key={item.role}
              delay={index * 100}
            >

              <article className="group h-full rounded-2xl border border-white/[0.08] bg-[#080808] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/[0.18]">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-700">
                    0{index + 1}
                  </p>

                  <span className="text-neutral-700 transition group-hover:text-white">
                    ↗
                  </span>

                </div>

                <h3 className="mt-8 text-2xl font-semibold">
                  {item.role}
                </h3>

                <p className="mt-4 text-sm leading-6 text-neutral-500">
                  {item.description}
                </p>

                <div className="mt-7 border-t border-white/[0.07] pt-5 text-sm font-medium text-neutral-400 transition group-hover:text-white">
                  {item.action} →
                </div>

              </article>

            </Reveal>

          ))}

        </div>

      </section>

      {/* =====================================================
          WORKFLOW
      ===================================================== */}

      <section
        id="workflow"
        className="scroll-mt-20 border-y border-white/[0.06] bg-[#050505]"
      >

        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">

          <Reveal>

            <div className="text-center">

              <p className="text-sm font-medium text-neutral-400">
                Simple workflow
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                From inquiry to deal.
              </h2>

            </div>

          </Reveal>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-4">

            {workflow.map(
              ([number, title, description], index) => (

                <Reveal
                  key={number}
                  delay={index * 100}
                >

                  <div className="group relative rounded-2xl border border-white/[0.07] bg-black p-6 text-center transition hover:border-white/[0.18]">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-sm font-semibold transition group-hover:bg-white group-hover:text-black">
                      {number}
                    </div>

                    <h3 className="mt-5 font-semibold">
                      {title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-neutral-600">
                      {description}
                    </p>

                  </div>

                </Reveal>

              )
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[130px]" />

        <Reveal>

          <div className="relative mx-auto max-w-4xl px-5 py-28 text-center sm:px-8">

            <p className="text-sm font-medium text-neutral-400">
              Ready to get started?
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Simplify your sales workflow.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
              Bring your products, leads, team, and quotations
              together with LeadMS.
            </p>

            <Link
              to="/register"
              className="group mt-8 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Create your account

              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

          </div>

        </Reveal>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.08]">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">

          <p>
            © 2026 LeadMS. All rights reserved.
          </p>

          <div className="flex gap-5">

            <Link
              to="/login"
              className="transition hover:text-white"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="transition hover:text-white"
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