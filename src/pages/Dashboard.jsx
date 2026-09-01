import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const statusStyles = {
  New: "bg-blue-500/10 text-blue-400",
  Contacted: "bg-amber-500/10 text-amber-400",
  Quoted: "bg-indigo-500/10 text-indigo-400",
  Accepted: "bg-emerald-500/10 text-emerald-400",
  Rejected: "bg-red-500/10 text-red-400",
};

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const role = user?.role?.toLowerCase();

  const roleName =
    role === "trader"
      ? "Trader"
      : role === "vendor"
        ? "Vendor"
        : role === "team-member"
          ? "Sales"
          : role === "admin"
            ? "Admin"
            : "Your";

  const stats = [
    {
      label: "Total Leads",
      value: "24",
      change: "+12.5%",
      icon: "◎",
    },
    {
      label: "Active Quotes",
      value: "12",
      change: "+8.2%",
      icon: "◇",
    },
    {
      label: "Revenue",
      value: "₹1.24L",
      change: "+18.4%",
      icon: "₹",
    },
    {
      label: "Products",
      value: "48",
      change: "+4.6%",
      icon: "▦",
    },
  ];

  const pipeline = [
    {
      label: "New",
      count: 8,
    },
    {
      label: "Contacted",
      count: 6,
    },
    {
      label: "Quoted",
      count: 5,
    },
    {
      label: "Accepted",
      count: 3,
    },
    {
      label: "Rejected",
      count: 2,
    },
  ];

  const recentLeads = [
    {
      name: "Rahul Sharma",
      company: "Sharma Industries",
      status: "New",
      value: "₹45,000",
    },
    {
      name: "Amit Verma",
      company: "Verma Enterprises",
      status: "Quoted",
      value: "₹78,500",
    },
    {
      name: "Neha Singh",
      company: "Singh Trading Co.",
      status: "Contacted",
      value: "₹32,000",
    },
    {
      name: "Arjun Mehta",
      company: "Mehta Solutions",
      status: "Accepted",
      value: "₹96,000",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Good to see you, {user?.firstName || "there"}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Here's what's happening with your {roleName.toLowerCase()}{" "}
            workspace and sales pipeline.
          </p>
        </div>

        <Link
          to="/dashboard/leads"
          className="inline-flex w-fit items-center rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-400"
        >
          + New Lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-400">
                {stat.label}
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-sm text-indigo-400">
                {stat.icon}
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <p className="text-3xl font-bold tracking-tight">
                {stat.value}
              </p>

              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                {stat.change}
              </span>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-2/3 rounded-full bg-indigo-500/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-semibold">
              Sales pipeline
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Track leads through each stage of the sales process.
            </p>
          </div>

          <Link
            to="/dashboard/leads"
            className="text-sm text-indigo-400 transition hover:text-indigo-300"
          >
            View pipeline →
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {pipeline.map((stage, index) => (
            <div
              key={stage.label}
              className="relative rounded-xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    index === 0
                      ? "bg-blue-400"
                      : index === 1
                        ? "bg-amber-400"
                        : index === 2
                          ? "bg-indigo-400"
                          : index === 3
                            ? "bg-emerald-400"
                            : "bg-red-400"
                  }`}
                />

                <span className="text-2xl font-bold">
                  {stage.count}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                {stage.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Leads + Quick Actions */}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">

        {/* Recent leads */}
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
            <div>
              <h2 className="font-semibold">
                Recent leads
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest activity in your pipeline
              </p>
            </div>

            <Link
              to="/dashboard/leads"
              className="text-sm text-indigo-400 transition hover:text-indigo-300"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentLeads.map((lead) => (
              <div
                key={lead.name}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-800/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                    {lead.name.charAt(0)}
                  </div>

                  <div>
                    <p className="font-medium">
                      {lead.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {lead.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <span className="text-sm font-medium text-slate-300">
                    {lead.value}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[lead.status]
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="font-semibold">
            Quick actions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Jump into your most common workflows.
          </p>

          <div className="mt-5 space-y-3">

            <Link
              to="/dashboard/leads"
              className="flex items-center gap-4 rounded-xl border border-slate-800 p-4 transition hover:border-indigo-500/30 hover:bg-indigo-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                ◎
              </div>

              <div>
                <p className="text-sm font-medium">
                  Manage leads
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  View and update your pipeline
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/quotes"
              className="flex items-center gap-4 rounded-xl border border-slate-800 p-4 transition hover:border-indigo-500/30 hover:bg-indigo-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                ◇
              </div>

              <div>
                <p className="text-sm font-medium">
                  Create a quote
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Generate a customer quotation
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/locked-products"
              className="flex items-center gap-4 rounded-xl border border-slate-800 p-4 transition hover:border-indigo-500/30 hover:bg-indigo-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                ▦
              </div>

              <div>
                <p className="text-sm font-medium">
                  Product catalog
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Browse your available products
                </p>
              </div>
            </Link>

          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;