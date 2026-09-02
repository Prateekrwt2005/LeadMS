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
   LAZY REVEAL
========================================================= */

function Reveal({ children, className = "", delay = 0 }) {
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

/* =========================================================
   LANDING
========================================================= */

function Landing() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("leadms-theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return true;
  });

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "leadms-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

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

  /* =========================================================
     THEME CLASSES
  ========================================================= */

  const pageBg = darkMode
    ? "bg-black text-white"
    : "bg-[#f7f7f5] text-[#111111]";

  const headerBg = darkMode
    ? "border-white/[0.08] bg-black/85"
    : "border-black/[0.08] bg-white/85";

  const mutedText = darkMode
    ? "text-neutral-500"
    : "text-neutral-600";

  const secondaryText = darkMode
    ? "text-neutral-400"
    : "text-neutral-700";

  const cardBg = darkMode
    ? "border-white/[0.08] bg-[#080808]"
    : "border-black/[0.08] bg-white";

  const cardHover = darkMode
    ? "hover:border-white/[0.18] hover:bg-[#0c0c0c]"
    : "hover:border-black/[0.18] hover:bg-[#fafafa]";

  return (
    <main
      className={`min-h-screen overflow-hidden selection:bg-neutral-900 selection:text-white transition-colors duration-500 ${pageBg}`}
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500 ${headerBg}`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <Link
            to="/"
            className="group text-2xl font-bold tracking-tight"
          >
            Lead
            <span
              className={`transition-colors duration-300 ${
                darkMode
                  ? "text-neutral-300 group-hover:text-white"
                  : "text-neutral-500 group-hover:text-black"
              }`}
            >
              MS
            </span>
          </Link>

          {/* Navigation */}

          <nav
            className={`hidden items-center gap-8 text-sm md:flex ${
              mutedText
            }`}
          >
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="transition hover:text-current hover:scale-105"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("roles")}
              className="transition hover:text-current hover:scale-105"
            >
              Roles
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("workflow")}
              className="transition hover:text-current hover:scale-105"
            >
              Workflow
            </button>
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* Theme Toggle */}

            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                darkMode
                  ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.09]"
                  : "border-black/10 bg-black/[0.03] hover:bg-black/[0.07]"
              }`}
            >
              <span
                className={`text-base transition-all duration-300 ${
                  darkMode
                    ? "rotate-0 opacity-100"
                    : "rotate-90 opacity-100"
                }`}
              >
                {darkMode ? "☀" : "☾"}
              </span>
            </button>

            <Link
              to="/login"
              className={`hidden rounded-lg px-4 py-2.5 text-sm font-medium transition sm:block ${
                darkMode
                  ? "text-neutral-400 hover:text-white"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                darkMode
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
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

        {/* Animated background */}

        <div
          className={`pointer-events-none absolute left-1/2 top-0 h-[420px] w-[650px] -translate-x-1/2 rounded-full blur-[140px] animate-pulse ${
            darkMode
              ? "bg-white/[0.035]"
              : "bg-black/[0.035]"
          }`}
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-14">

          {/* HERO LEFT */}

          <Reveal>
            <div>

              {/* Badge */}

              <div
                className={`mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  darkMode
                    ? "border-white/[0.12] bg-white/[0.035] text-neutral-300"
                    : "border-black/[0.10] bg-black/[0.03] text-neutral-700"
                }`}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />

                Smarter sales management
              </div>

              {/* Heading */}

              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Manage leads.
                <br />

                Close deals.
                <br />

                <span className={mutedText}>
                  Grow faster.
                </span>
              </h1>

              {/* Description */}

              <p
                className={`mt-6 max-w-2xl text-base leading-7 sm:text-lg ${mutedText}`}
              >
                LeadMS brings products, leads, sales teams, and
                customer quotations together in one powerful
                workspace.
              </p>

              {/* Buttons */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className={`group inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${
                    darkMode
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-black text-white hover:bg-neutral-800"
                  }`}
                >
                  Get started

                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${
                    darkMode
                      ? "border-white/[0.12] bg-white/[0.02] text-neutral-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                      : "border-black/[0.12] bg-black/[0.02] text-neutral-700 hover:border-black/25 hover:bg-black/[0.05] hover:text-black"
                  }`}
                >
                  Sign in
                </Link>
              </div>

              {/* Features */}

              <div
                className={`mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs ${
                  darkMode
                    ? "text-neutral-600"
                    : "text-neutral-500"
                }`}
              >
                <span>✓ Product management</span>
                <span>✓ Lead pipeline</span>
                <span>✓ Smart quotations</span>
              </div>

            </div>
          </Reveal>

          {/* DASHBOARD PREVIEW */}

          <Reveal
            delay={120}
            className="relative"
          >
            <div
              className={`absolute -inset-6 rounded-[2rem] blur-3xl ${
                darkMode
                  ? "bg-white/[0.025]"
                  : "bg-black/[0.025]"
              }`}
            />

            <div
              className={`relative overflow-hidden rounded-2xl border shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                darkMode
                  ? "border-white/[0.10] bg-[#090909]"
                  : "border-black/[0.10] bg-white"
              }`}
            >

              {/* Browser bar */}

              <div
                className={`flex items-center justify-between border-b px-5 py-4 ${
                  darkMode
                    ? "border-white/[0.08]"
                    : "border-black/[0.08]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                </div>

                <span
                  className={`text-[10px] ${
                    darkMode
                      ? "text-neutral-600"
                      : "text-neutral-400"
                  }`}
                >
                  app.leadms.com
                </span>
              </div>

              <div className="p-5 sm:p-6">

                {/* Dashboard header */}

                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-[10px] uppercase tracking-widest ${
                        darkMode
                          ? "text-neutral-600"
                          : "text-neutral-400"
                      }`}
                    >
                      Overview
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Dashboard
                    </p>
                  </div>

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                      darkMode
                        ? "border-white/10 bg-white/[0.06]"
                        : "border-black/10 bg-black/[0.04]"
                    }`}
                  >
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
                      <div
                        className={`rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
                          darkMode
                            ? "border-white/[0.08] bg-black hover:border-white/[0.18]"
                            : "border-black/[0.08] bg-[#fafafa] hover:border-black/[0.18]"
                        }`}
                      >
                        <p
                          className={`text-[10px] uppercase tracking-wider ${
                            darkMode
                              ? "text-neutral-600"
                              : "text-neutral-400"
                          }`}
                        >
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

                <div
                  className={`mt-4 rounded-xl border p-4 ${
                    darkMode
                      ? "border-white/[0.08] bg-black"
                      : "border-black/[0.08] bg-[#fafafa]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">
                      Sales pipeline
                    </p>

                    <span
                      className={`text-[10px] ${
                        darkMode
                          ? "text-neutral-600"
                          : "text-neutral-400"
                      }`}
                    >
                      This month
                    </span>
                  </div>

                  <div className="mt-5 flex h-24 items-end gap-2">
                    {[55, 72, 45, 85, 65, 92, 78].map(
                      (height, index) => (
                        <div
                          key={index}
                          className={`flex-1 rounded-t-md transition-all duration-500 hover:-translate-y-1 ${
                            darkMode
                              ? "bg-white/[0.18] hover:bg-white/[0.35]"
                              : "bg-black/[0.12] hover:bg-black/[0.25]"
                          }`}
                          style={{
                            height: `${height}%`,
                            animation: `growBar 900ms ease-out ${
                              index * 80
                            }ms both`,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Performance */}

                <div
                  className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 ${
                    darkMode
                      ? "border-white/[0.08] bg-white/[0.025]"
                      : "border-black/[0.08] bg-black/[0.025]"
                  }`}
                >
                  <div>
                    <p className="text-xs font-medium">
                      Pipeline performance
                    </p>

                    <p
                      className={`mt-1 text-[10px] ${
                        darkMode
                          ? "text-neutral-600"
                          : "text-neutral-400"
                      }`}
                    >
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
        className={`scroll-mt-20 border-y transition-colors duration-500 ${
          darkMode
            ? "border-white/[0.06]"
            : "border-black/[0.06]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">

          <Reveal>
            <div className="max-w-2xl">
              <p className={`text-sm font-medium ${secondaryText}`}>
                Everything in one place
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Everything your sales team needs.
              </h2>

              <p
                className={`mt-4 text-sm leading-6 sm:text-base ${mutedText}`}
              >
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
                <article
                  className={`group h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-2 ${cardBg} ${cardHover}`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition-all duration-300 group-hover:rotate-6 ${
                        darkMode
                          ? "border-white/[0.08] bg-white/[0.04]"
                          : "border-black/[0.08] bg-black/[0.04]"
                      }`}
                    >
                      {feature.icon}
                    </div>

                    <span
                      className={`text-xs ${
                        darkMode
                          ? "text-neutral-700"
                          : "text-neutral-400"
                      }`}
                    >
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p
                    className={`mt-3 text-sm leading-6 ${mutedText}`}
                  >
                    {feature.description}
                  </p>

                  <div
                    className={`mt-7 h-px ${
                      darkMode
                        ? "bg-white/[0.06]"
                        : "bg-black/[0.06]"
                    }`}
                  />

                  <div
                    className={`mt-4 text-xs font-medium transition ${
                      darkMode
                        ? "text-neutral-600 group-hover:text-neutral-300"
                        : "text-neutral-500 group-hover:text-black"
                    }`}
                  >
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
            <p className={`text-sm font-medium ${secondaryText}`}>
              One platform. Every role.
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Built around your team.
            </h2>

            <p
              className={`mt-4 text-sm leading-6 sm:text-base ${mutedText}`}
            >
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
              <article
                className={`group h-full rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-2 ${cardBg} ${cardHover}`}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={`text-xs font-medium uppercase tracking-[0.2em] ${
                      darkMode
                        ? "text-neutral-700"
                        : "text-neutral-400"
                    }`}
                  >
                    0{index + 1}
                  </p>

                  <span
                    className={`transition group-hover:translate-x-1 group-hover:-translate-y-1 ${
                      darkMode
                        ? "text-neutral-700 group-hover:text-white"
                        : "text-neutral-400 group-hover:text-black"
                    }`}
                  >
                    ↗
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold">
                  {item.role}
                </h3>

                <p
                  className={`mt-4 text-sm leading-6 ${mutedText}`}
                >
                  {item.description}
                </p>

                <div
                  className={`mt-7 border-t pt-5 text-sm font-medium transition ${
                    darkMode
                      ? "border-white/[0.07] text-neutral-400 group-hover:text-white"
                      : "border-black/[0.07] text-neutral-500 group-hover:text-black"
                  }`}
                >
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
        className={`scroll-mt-20 border-y transition-colors duration-500 ${
          darkMode
            ? "border-white/[0.06] bg-[#050505]"
            : "border-black/[0.06] bg-[#f1f1ef]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">

          <Reveal>
            <div className="text-center">
              <p className={`text-sm font-medium ${secondaryText}`}>
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
                  <div
                    className={`group relative rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-2 ${cardBg} ${cardHover}`}
                  >
                    <div
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 group-hover:scale-110 ${
                        darkMode
                          ? "border-white/[0.12] bg-white/[0.04] group-hover:bg-white group-hover:text-black"
                          : "border-black/[0.12] bg-black/[0.04] group-hover:bg-black group-hover:text-white"
                      }`}
                    >
                      {number}
                    </div>

                    <h3 className="mt-5 font-semibold">
                      {title}
                    </h3>

                    <p
                      className={`mt-2 text-xs leading-5 ${mutedText}`}
                    >
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

        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] ${
            darkMode
              ? "bg-white/[0.025]"
              : "bg-black/[0.025]"
          }`}
        />

        <Reveal>
          <div className="relative mx-auto max-w-4xl px-5 py-28 text-center sm:px-8">

            <p className={`text-sm font-medium ${secondaryText}`}>
              Ready to get started?
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Simplify your sales workflow.
            </h2>

            <p
              className={`mx-auto mt-5 max-w-xl text-sm leading-6 sm:text-base ${mutedText}`}
            >
              Bring your products, leads, team, and quotations
              together with LeadMS.
            </p>

            <Link
              to="/register"
              className={`group mt-8 inline-flex items-center rounded-xl px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 ${
                darkMode
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              Create your account

              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className={`border-t transition-colors duration-500 ${
          darkMode
            ? "border-white/[0.08]"
            : "border-black/[0.08]"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 ${
            darkMode
              ? "text-neutral-600"
              : "text-neutral-500"
          }`}
        >
          <p>
            © 2026 LeadMS. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              to="/login"
              className="transition hover:text-current"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="transition hover:text-current"
            >
              Get started
            </Link>
          </div>
        </div>
      </footer>

      {/* =====================================================
          LOCAL ANIMATION
      ===================================================== */}

      <style>{`
        @keyframes growBar {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
            opacity: 0;
          }

          to {
            transform: scaleY(1);
            transform-origin: bottom;
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}

export default Landing;