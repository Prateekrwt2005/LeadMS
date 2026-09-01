import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";

const PIPELINE_STAGES = [
  {
    key: "new",
    label: "New",
  },
  {
    key: "contacted",
    label: "Contacted",
  },
  {
    key: "quoted",
    label: "Quoted",
  },
  {
    key: "accepted",
    label: "Accepted",
  },
  {
    key: "rejected",
    label: "Rejected",
  },
];

const statusStyles = {
  new: "border-white/10 bg-white/[0.04] text-white",
  contacted: "border-white/10 bg-white/[0.04] text-slate-300",
  quoted: "border-white/10 bg-white/[0.04] text-slate-200",
  accepted: "border-white/15 bg-white/[0.08] text-white",
  rejected: "border-white/10 bg-white/[0.02] text-slate-500",
};

function normalizeStatus(status) {
  return String(status || "new")
    .trim()
    .toLowerCase();
}

function formatCurrency(value) {
  const amount = Number(value || 0);

  if (!Number.isFinite(amount) || amount === 0) {
    return "₹0";
  }

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function getArrayFromResponse(data, key = null) {
  if (Array.isArray(data)) {
    return data;
  }

  if (key && Array.isArray(data?.[key])) {
    return data[key];
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

function getLeadValue(lead) {
  const possibleValues = [
    lead?.finalTotal,
    lead?.totalAmount,
    lead?.quotedAmount,
    lead?.quoteAmount,
    lead?.amount,
    lead?.value,
    lead?.quote?.finalTotal,
    lead?.quote?.total,
    lead?.quote?.totalAmount,
  ];

  for (const value of possibleValues) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return 0;
}

function getCustomerName(lead) {
  return (
    lead?.customerName ||
    lead?.name ||
    lead?.customer?.name ||
    "Unnamed customer"
  );
}

function getCompanyName(lead) {
  return (
    lead?.company ||
    lead?.companyName ||
    lead?.customerCompany ||
    lead?.customer?.company ||
    "No company"
  );
}

function getLeadDate(lead) {
  return (
    lead?.createdAt ||
    lead?.updatedAt ||
    lead?.created_at ||
    null
  );
}

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const role = String(user?.role || "").toLowerCase();

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

  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        /*
         * ADMIN
         */
        if (role === "admin") {
          const response = await api.get("/admin/analytics");

          setAnalytics(response.data);
          setLeads([]);
          setProducts([]);

          return;
        }

        /*
         * VENDOR / TEAM MEMBER
         */
        if (
          role === "vendor" ||
          role === "team-member"
        ) {
          const results = await Promise.allSettled([
            api.get("/leads"),
            api.get("/products/locked"),
          ]);

          const leadsResult = results[0];
          const productsResult = results[1];

          if (leadsResult.status === "fulfilled") {
            setLeads(
              getArrayFromResponse(
                leadsResult.value.data,
                "leads"
              )
            );
          } else {
            console.error(
              "Dashboard /leads failed:",
              leadsResult.reason
            );

            setLeads([]);

            const status =
              leadsResult.reason?.response?.status;

            const message =
              leadsResult.reason?.response?.data?.message;

            setError(
              message ||
                `Unable to load leads${
                  status ? ` (${status})` : ""
                }.`
            );
          }

          if (productsResult.status === "fulfilled") {
            setProducts(
              getArrayFromResponse(
                productsResult.value.data,
                "products"
              )
            );
          } else {
            console.error(
              "Dashboard /products/locked failed:",
              productsResult.reason
            );

            setProducts([]);

            const status =
              productsResult.reason?.response?.status;

            const message =
              productsResult.reason?.response?.data?.message;

            setError((currentError) => {
              if (currentError) {
                return currentError;
              }

              return (
                message ||
                `Unable to load products${
                  status ? ` (${status})` : ""
                }.`
              );
            });
          }

          return;
        }

        /*
         * TRADER
         */
        if (role === "trader") {
          const response = await api.get(
            "/products/trader"
          );

          setProducts(
            getArrayFromResponse(
              response.data,
              "products"
            )
          );

          setLeads([]);

          return;
        }

        /*
         * UNKNOWN ROLE
         */
        setLeads([]);
        setProducts([]);
      } catch (dashboardError) {
        console.error(
          "Dashboard request failed:",
          dashboardError
        );

        setError(
          dashboardError.response?.data?.message ||
            `Unable to load dashboard${
              dashboardError.response?.status
                ? ` (${dashboardError.response.status})`
                : ""
            }.`
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [role]
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /*
   * PIPELINE
   */
  const pipeline = useMemo(() => {
    const counts = {
      new: 0,
      contacted: 0,
      quoted: 0,
      accepted: 0,
      rejected: 0,
    };

    leads.forEach((lead) => {
      const status = normalizeStatus(lead?.status);

      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });

    return PIPELINE_STAGES.map((stage) => ({
      ...stage,
      count: counts[stage.key],
    }));
  }, [leads]);

  /*
   * REVENUE
   */
  const revenue = useMemo(() => {
    if (role === "admin") {
      return Number(analytics?.revenue || 0);
    }

    return leads
      .filter(
        (lead) =>
          normalizeStatus(lead?.status) ===
          "accepted"
      )
      .reduce(
        (total, lead) =>
          total + getLeadValue(lead),
        0
      );
  }, [leads, role, analytics]);

  /*
   * STATS
   */
  const stats = useMemo(() => {
    if (role === "admin") {
      return [
        {
          label: "Total Users",
          value: analytics?.userCount ?? 0,
          note: "Platform",
          icon: "◎",
        },
        {
          label: "Total Leads",
          value: analytics?.leadCount ?? 0,
          note: "Platform",
          icon: "◇",
        },
        {
          label: "Revenue",
          value: formatCurrency(
            analytics?.revenue ?? 0
          ),
          note: "Platform",
          icon: "₹",
        },
        {
          label: "Products",
          value: analytics?.productCount ?? 0,
          note: "Platform",
          icon: "▦",
        },
      ];
    }

    if (role === "trader") {
      return [
        {
          label: "Products",
          value: products.length,
          note: "Live data",
          icon: "▦",
        },
        {
          label: "Active Products",
          value: products.filter(
            (product) =>
              product?.isActive !== false
          ).length,
          note: "Live data",
          icon: "◉",
        },
        {
          label: "Inactive Products",
          value: products.filter(
            (product) =>
              product?.isActive === false
          ).length,
          note: "Live data",
          icon: "○",
        },
        {
          label: "Catalog",
          value: products.length,
          note: "Live data",
          icon: "◇",
        },
      ];
    }

    return [
      {
        label: "Total Leads",
        value: leads.length,
        note: "Live data",
        icon: "◎",
      },
      {
        label: "Active Quotes",
        value:
          pipeline.find(
            (stage) => stage.key === "quoted"
          )?.count || 0,
        note: "Quoted",
        icon: "◇",
      },
      {
        label: "Revenue",
        value: formatCurrency(revenue),
        note: "Accepted",
        icon: "₹",
      },
      {
        label: "Products",
        value: products.length,
        note: "Live data",
        icon: "▦",
      },
    ];
  }, [
    role,
    analytics,
    products,
    leads.length,
    pipeline,
    revenue,
  ]);

  /*
   * RECENT LEADS
   */
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => {
        const first = new Date(
          getLeadDate(a) || 0
        ).getTime();

        const second = new Date(
          getLeadDate(b) || 0
        ).getTime();

        return second - first;
      })
      .slice(0, 5);
  }, [leads]);

  /*
   * LOADING
   *
   * Important:
   * DashboardLayout already provides page padding.
   * Therefore we DO NOT add p-5/p-7/p-8 here.
   */
  if (loading) {
    return (
      <div className="w-full space-y-7">

        {/* Header skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-9 w-80 max-w-full rounded bg-white/10" />
            <div className="h-4 w-[480px] max-w-full rounded bg-white/5" />
          </div>

          <div className="flex gap-3">
            <div className="h-11 w-24 animate-pulse rounded-xl bg-white/5" />
            <div className="h-11 w-32 animate-pulse rounded-xl bg-white/10" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl border border-white/10 bg-[#050505]"
            />
          ))}
        </div>

        {/* Pipeline skeleton */}
        <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-[#050505]" />

        {/* Bottom skeleton */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-[#050505]" />
          <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-[#050505]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Good to see you,{" "}
            {user?.firstName || "there"}.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Here's what's happening with your{" "}
            {roleName.toLowerCase()} workspace and sales
            pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-400 transition duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          {role !== "admin" && (
            <Link
              to="/dashboard/leads"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 active:scale-95"
            >
              + New Lead
            </Link>
          )}

        </div>
      </header>

      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-white">
              Some dashboard data couldn't be loaded.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchDashboard(true)}
            className="w-fit rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Try again
          </button>

        </div>
      )}

      {/* =========================================================
          STATS
      ========================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#050505] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black"
          >

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.02] blur-3xl transition duration-500 group-hover:bg-white/[0.07]" />

            <div className="relative flex items-start justify-between">

              <p className="text-sm text-slate-500">
                {stat.label}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-slate-300 transition duration-300 group-hover:scale-110 group-hover:border-white/20 group-hover:bg-white/[0.07] group-hover:text-white">
                {stat.icon}
              </div>

            </div>

            <div className="relative mt-6 flex items-end justify-between gap-3">

              <p className="text-3xl font-semibold tracking-tight text-white">
                {stat.value}
              </p>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                {stat.note}
              </span>

            </div>

            <div className="mt-5 h-px overflow-hidden bg-white/10">
              <div
                className="h-full bg-white transition-all duration-700 group-hover:w-full"
                style={{
                  width: `${25 + index * 15}%`,
                }}
              />
            </div>

          </div>
        ))}

      </section>

      {/* =========================================================
          PIPELINE
      ========================================================== */}

      {role !== "trader" && (
        <section className="rounded-2xl border border-white/10 bg-[#050505] p-5 sm:p-6">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Pipeline
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Sales pipeline
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Live lead distribution across each stage.
              </p>
            </div>

            <Link
              to="/dashboard/leads"
              className="text-sm text-slate-500 transition hover:text-white"
            >
              View pipeline →
            </Link>

          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

            {pipeline.map((stage) => {

              const total = pipeline.reduce(
                (sum, item) =>
                  sum + item.count,
                0
              );

              const percentage =
                total > 0
                  ? (stage.count / total) * 100
                  : 0;

              return (
                <div
                  key={stage.key}
                  className="group rounded-xl border border-white/10 bg-black p-4 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.02]"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-white transition duration-300 group-hover:scale-125" />

                      <span className="text-[10px] uppercase tracking-wider text-slate-600">
                        Stage
                      </span>

                    </div>

                    <span className="text-2xl font-semibold text-white">
                      {stage.count}
                    </span>

                  </div>

                  <p className="mt-5 text-sm text-slate-400">
                    {stage.label}
                  </p>

                  <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-700 group-hover:bg-slate-300"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-[10px] text-slate-700">
                    {percentage > 0
                      ? `${percentage.toFixed(0)}% of leads`
                      : "No leads"}
                  </p>

                </div>
              );
            })}

          </div>

        </section>
      )}

      {/* =========================================================
          RECENT LEADS + QUICK ACTIONS
      ========================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

        {/* RECENT LEADS */}

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">

          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Activity
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Recent leads
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Latest activity in your pipeline.
              </p>
            </div>

            <Link
              to="/dashboard/leads"
              className="text-sm text-slate-500 transition hover:text-white"
            >
              View all →
            </Link>

          </div>

          {recentLeads.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-600">
                ◎
              </div>

              <p className="mt-4 text-sm font-medium text-slate-400">
                No leads found
              </p>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-600">
                Leads returned by your backend will appear
                here automatically.
              </p>

              {role !== "admin" && (
                <Link
                  to="/dashboard/leads"
                  className="mt-5 inline-flex rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Manage leads
                </Link>
              )}

            </div>
          ) : (
            <div className="divide-y divide-white/[0.07]">

              {recentLeads.map((lead) => {

                const customerName =
                  getCustomerName(lead);

                const company =
                  getCompanyName(lead);

                const status =
                  normalizeStatus(
                    lead?.status
                  );

                const value =
                  getLeadValue(lead);

                return (
                  <div
                    key={
                      lead?._id ||
                      `${customerName}-${company}`
                    }
                    className="group flex flex-col gap-4 px-5 py-5 transition duration-200 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm font-medium text-slate-300 transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:text-white">
                        {customerName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-medium text-white">
                          {customerName}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-600">
                          {company}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">

                      <span className="text-sm font-medium text-slate-300">
                        {formatCurrency(value)}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                          statusStyles[status] ||
                          statusStyles.new
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* QUICK ACTIONS */}

        <section className="rounded-2xl border border-white/10 bg-[#050505] p-5 sm:p-6">

          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Shortcuts
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Quick actions
          </h2>

          <p className="mt-1 text-xs text-slate-600">
            Jump into your most common workflows.
          </p>

          <div className="mt-5 space-y-3">

            <Link
              to="/dashboard/leads"
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-black p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.03]"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition duration-300 group-hover:scale-105 group-hover:bg-white/[0.07] group-hover:text-white">
                ◎
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-white">
                  Manage leads
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  View and update your pipeline
                </p>

              </div>

              <span className="text-lg text-slate-700 transition duration-300 group-hover:translate-x-1 group-hover:text-white">
                →
              </span>

            </Link>

            <Link
              to="/dashboard/quotes"
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-black p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.03]"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition duration-300 group-hover:scale-105 group-hover:bg-white/[0.07] group-hover:text-white">
                ◇
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-white">
                  Create a quote
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Generate a customer quotation
                </p>

              </div>

              <span className="text-lg text-slate-700 transition duration-300 group-hover:translate-x-1 group-hover:text-white">
                →
              </span>

            </Link>

            <Link
              to="/dashboard/locked-products"
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-black p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.03]"
            >

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition duration-300 group-hover:scale-105 group-hover:bg-white/[0.07] group-hover:text-white">
                ▦
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium text-white">
                  Product catalog
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Browse your available products
                </p>

              </div>

              <span className="text-lg text-slate-700 transition duration-300 group-hover:translate-x-1 group-hover:text-white">
                →
              </span>

            </Link>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;