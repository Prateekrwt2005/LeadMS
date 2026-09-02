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

        <div className="h-48 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.02]" />
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

  /* =========================
     NORMALIZE API RESPONSE
  ========================= */

  const users =
    analytics?.users ||
    {};

  const leads =
    analytics?.leads ||
    {};

  const products =
    analytics?.products ||
    {};

  const revenue =
    analytics?.revenue ||
    {};

  /*
    Supports the assignment's nested response:

    users: {
      trader,
      vendor,
      team-member
    }

    leads: {
      total,
      byStatus
    }

    products: {
      total,
      active
    }

    revenue: {
      totalQuoted,
      totalExpectedMargin
    }

    Also keeps compatibility with a flat response
    if the provided backend returns one.
  */

  const traderCount = Number(users.trader || 0);
  const vendorCount = Number(users.vendor || 0);
  const teamMemberCount = Number(
    users["team-member"] || users.team || 0
  );

  const nestedUserCount =
    traderCount +
    vendorCount +
    teamMemberCount;

  const userCount =
    nestedUserCount > 0
      ? nestedUserCount
      : Number(analytics?.userCount || 0);

  const leadCount =
    leads.total !== undefined
      ? Number(leads.total || 0)
      : Number(analytics?.leadCount || 0);

  const productCount =
    products.total !== undefined
      ? Number(products.total || 0)
      : Number(analytics?.productCount || 0);

  const activeProductCount =
    products.active !== undefined
      ? Number(products.active || 0)
      : 0;

  const totalQuoted =
    revenue.totalQuoted !== undefined
      ? Number(revenue.totalQuoted || 0)
      : Number(analytics?.revenue || 0);

  const expectedMargin =
    revenue.totalExpectedMargin !== undefined
      ? Number(revenue.totalExpectedMargin || 0)
      : 0;

  const byStatus = leads.byStatus || {};

  const newLeads = Number(byStatus.new || 0);
  const contactedLeads = Number(byStatus.contacted || 0);
  const quotedLeads = Number(byStatus.quoted || 0);
  const acceptedLeads = Number(byStatus.accepted || 0);
  const rejectedLeads = Number(byStatus.rejected || 0);

  const stats = [
    {
      label: "Users",
      value: userCount,
      icon: "U",
    },
    {
      label: "Leads",
      value: leadCount,
      icon: "L",
    },
    {
      label: "Products",
      value: productCount,
      icon: "P",
    },
    {
      label: "Revenue",
      value: `₹${totalQuoted.toLocaleString("en-IN")}`,
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
          PLATFORM OVERVIEW
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

            <p className="mt-2 text-xl font-semibold text-white">
              {userCount}
            </p>
          </div>


          <div className="px-6 py-5">
            <p className="text-xs text-neutral-600">
              Total leads
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {leadCount}
            </p>
          </div>


          <div className="px-6 py-5">
            <p className="text-xs text-neutral-600">
              Product catalog
            </p>

            <p className="mt-2 text-xl font-semibold text-white">
              {productCount}
            </p>
          </div>

        </div>
      </div>


      {/* =========================
          USER BREAKDOWN
      ========================= */}

      <div className="rounded-2xl border border-white/[0.08] bg-[#080808]">

        <div className="border-b border-white/[0.07] px-6 py-5">
          <h2 className="text-sm font-semibold text-white">
            User distribution
          </h2>

          <p className="mt-1 text-xs text-neutral-600">
            Registered users grouped by platform role.
          </p>
        </div>


        <div className="grid divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <div className="px-6 py-5">
            <p className="text-xs text-neutral-600">
              Traders
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {traderCount}
            </p>
          </div>


          <div className="px-6 py-5">
            <p className="text-xs text-neutral-600">
              Vendors
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {vendorCount}
            </p>
          </div>


          <div className="px-6 py-5">
            <p className="text-xs text-neutral-600">
              Team members
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {teamMemberCount}
            </p>
          </div>

        </div>
      </div>


      {/* =========================
          PIPELINE + PRODUCTS
      ========================= */}

      <div className="grid gap-4 lg:grid-cols-2">

        {/* Lead pipeline */}

        <div className="rounded-2xl border border-white/[0.08] bg-[#080808]">

          <div className="border-b border-white/[0.07] px-6 py-5">
            <h2 className="text-sm font-semibold text-white">
              Lead pipeline
            </h2>

            <p className="mt-1 text-xs text-neutral-600">
              Current lead distribution by status.
            </p>
          </div>


          <div className="grid grid-cols-2 divide-x divide-white/[0.06] sm:grid-cols-3">

            <div className="border-b border-white/[0.06] px-5 py-5">
              <p className="text-xs text-neutral-600">
                New
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {newLeads}
              </p>
            </div>


            <div className="border-b border-white/[0.06] px-5 py-5">
              <p className="text-xs text-neutral-600">
                Contacted
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {contactedLeads}
              </p>
            </div>


            <div className="border-b border-white/[0.06] px-5 py-5">
              <p className="text-xs text-neutral-600">
                Quoted
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {quotedLeads}
              </p>
            </div>


            <div className="px-5 py-5">
              <p className="text-xs text-neutral-600">
                Accepted
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {acceptedLeads}
              </p>
            </div>


            <div className="px-5 py-5">
              <p className="text-xs text-neutral-600">
                Rejected
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {rejectedLeads}
              </p>
            </div>


            <div className="px-5 py-5">
              <p className="text-xs text-neutral-600">
                Total
              </p>

              <p className="mt-2 text-xl font-semibold text-white">
                {leadCount}
              </p>
            </div>

          </div>
        </div>


        {/* Product + revenue */}

        <div className="rounded-2xl border border-white/[0.08] bg-[#080808]">

          <div className="border-b border-white/[0.07] px-6 py-5">
            <h2 className="text-sm font-semibold text-white">
              Catalog & revenue
            </h2>

            <p className="mt-1 text-xs text-neutral-600">
              Product activity and quotation totals.
            </p>
          </div>


          <div className="divide-y divide-white/[0.06]">

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs text-neutral-600">
                  Total products
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  {productCount}
                </p>
              </div>

              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] text-neutral-500">
                Catalog
              </span>
            </div>


            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs text-neutral-600">
                  Active products
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  {activeProductCount}
                </p>
              </div>

              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] text-neutral-500">
                Active
              </span>
            </div>


            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs text-neutral-600">
                  Total quoted
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  ₹{totalQuoted.toLocaleString("en-IN")}
                </p>
              </div>

              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] text-neutral-500">
                Revenue
              </span>
            </div>


            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs text-neutral-600">
                  Expected margin
                </p>

                <p className="mt-1 text-lg font-semibold text-white">
                  ₹{expectedMargin.toLocaleString("en-IN")}
                </p>
              </div>

              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] text-neutral-500">
                Margin
              </span>
            </div>

          </div>
        </div>

      </div>


      {/* =========================
          FOOTER
      ========================= */}

      <p className="text-xs text-neutral-700">
        Analytics are synchronized with the LeadMS backend.
      </p>

    </div>
  );
}

export default AdminAnalytics;