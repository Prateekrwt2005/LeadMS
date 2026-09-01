import { useEffect, useState } from "react";
import api from "../services/api";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/analytics");

        setAnalytics(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <div className="h-4 w-28 animate-pulse rounded bg-white/[0.06]" />

          <div className="mt-3 h-9 w-64 animate-pulse rounded-lg bg-white/[0.06]" />

          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-white/[0.04]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.02]"
            />
          ))}
        </div>

      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-sm text-red-400">
            !
          </div>

          <div>
            <p className="text-sm font-medium text-red-400">
              Unable to load analytics
            </p>

            <p className="mt-1 text-xs leading-5 text-red-400/70">
              {error}
            </p>
          </div>

        </div>

      </div>
    );
  }

  const stats = [
    {
      label: "Users",
      value: analytics?.userCount ?? 0,
      icon: "U",
    },
    {
      label: "Leads",
      value: analytics?.leadCount ?? 0,
      icon: "L",
    },
    {
      label: "Products",
      value: analytics?.productCount ?? 0,
      icon: "P",
    },
    {
      label: "Revenue",
      value: `₹${Number(
        analytics?.revenue ?? 0
      ).toLocaleString("en-IN")}`,
      icon: "₹",
    },
  ];

  return (
    <div className="space-y-8">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
            Platform Analytics
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Monitor overall LeadMS platform activity and performance.
          </p>

        </div>

        {/* Status */}
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">

          <span className="h-1.5 w-1.5 rounded-full bg-white" />

          <span className="text-xs text-neutral-500">
            Live data
          </span>

        </div>

      </div>


      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.08] bg-[#080808] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.16]"
          >

            <div className="flex items-start justify-between">

              {/* Icon */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-neutral-400 transition group-hover:border-white/[0.16] group-hover:bg-white/[0.07] group-hover:text-white">
                {stat.icon}
              </div>

              <span className="text-[10px] uppercase tracking-wider text-neutral-700">
                Total
              </span>

            </div>


            <div className="mt-6">

              <p className="text-xs font-medium text-neutral-500">
                {stat.label}
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                {stat.value}
              </p>

            </div>

          </div>
        ))}

      </div>


      {/* =========================
          OVERVIEW PANEL
      ========================= */}

      <div className="rounded-2xl border border-white/[0.08] bg-[#080808]">

        <div className="flex flex-col gap-2 border-b border-white/[0.07] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-sm font-semibold text-white">
              Platform overview
            </h2>

            <p className="mt-1 text-xs text-neutral-600">
              Current system totals from your LeadMS backend.
            </p>
          </div>

          <span className="text-xs text-neutral-600">
            Admin
          </span>

        </div>


        <div className="grid divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <div className="px-6 py-5">

            <p className="text-xs text-neutral-600">
              Registered users
            </p>

            <p className="mt-2 text-xl font-semibold">
              {analytics?.userCount ?? 0}
            </p>

          </div>


          <div className="px-6 py-5">

            <p className="text-xs text-neutral-600">
              Total leads
            </p>

            <p className="mt-2 text-xl font-semibold">
              {analytics?.leadCount ?? 0}
            </p>

          </div>


          <div className="px-6 py-5">

            <p className="text-xs text-neutral-600">
              Product catalog
            </p>

            <p className="mt-2 text-xl font-semibold">
              {analytics?.productCount ?? 0}
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          FOOTER NOTE
      ========================= */}

      <p className="text-xs text-neutral-700">
        Analytics are synchronized with the LeadMS backend.
      </p>

    </div>
  );
}

export default AdminAnalytics;