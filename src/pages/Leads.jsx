import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";

const statuses = [
  "all",
  "new",
  "contacted",
  "quoted",
  "accepted",
  "rejected",
];

const statusStyles = {
  new: "border-white/10 bg-white/[0.05] text-slate-300",
  contacted: "border-white/10 bg-white/[0.05] text-slate-300",
  quoted: "border-white/10 bg-white/[0.07] text-white",
  accepted: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
  rejected: "border-red-500/20 bg-red-500/5 text-red-300",
};

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [creating, setCreating] = useState(false);

  const fetchInProgress = useRef(false);

  const fetchLeads = async () => {
    if (fetchInProgress.current) return;

    fetchInProgress.current = true;

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leads", {
        timeout: 15000,
      });

      setLeads(response.data);
    } catch (error) {
      console.error("Failed to load leads:", error);

      if (error.code === "ECONNABORTED") {
        setError(
          "The server is taking too long to respond. Please try again."
        );
      } else if (error.response?.status === 401) {
        setError(
          "Your session has expired. Please sign in again."
        );
      } else if (error.response?.status >= 500) {
        setError(
          "The server is temporarily unavailable. Please try again later."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to load leads. Please try again."
        );
      }
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");

      await api.post("/leads", form);

      setForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
      });

      setShowForm(false);

      await fetchLeads();
    } catch (error) {
      console.error("Failed to create lead:", error);

      if (error.code === "ECONNABORTED") {
        setError(
          "The server is taking too long to respond. Please try again."
        );
      } else if (error.response?.status >= 500) {
        setError(
          "The server is temporarily unavailable. Please try again later."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Unable to create lead. Please try again."
        );
      }
    } finally {
      setCreating(false);
    }
  };

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const status = (
        lead.status || "new"
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        lead.customerName
          ?.toLowerCase()
          .includes(query) ||
        lead.customerEmail
          ?.toLowerCase()
          .includes(query) ||
        lead.customerPhone
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [leads, search, statusFilter]);

  const getCount = (status) => {
    return leads.filter(
      (lead) =>
        (lead.status || "new").toLowerCase() === status
    ).length;
  };

  return (
    <div className="w-full space-y-7">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Sales Pipeline
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Leads
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage customer inquiries and track their
            progress through your sales pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={fetchLeads}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-400 transition duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 active:scale-95"
          >
            {showForm ? "Cancel" : "+ New Lead"}
          </button>

        </div>

      </header>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-red-300">
              Something went wrong
            </p>

            <p className="mt-1 text-xs text-red-400/70">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchLeads}
            className="w-fit rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/10 hover:text-white"
          >
            Try again
          </button>

        </div>
      )}

      {/* =====================================================
          CREATE LEAD
      ====================================================== */}

      {showForm && (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">

          <div className="border-b border-white/[0.08] px-5 py-5 sm:px-6">

            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
              New record
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Create new lead
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Add a customer to your sales pipeline.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-5 sm:p-6 md:grid-cols-3"
          >

            {/* Customer name */}

            <div>
              <label
                htmlFor="customerName"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Customer name
              </label>

              <input
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Acme Corp"
                required
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
              />
            </div>

            {/* Email */}

            <div>
              <label
                htmlFor="customerEmail"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Email address
              </label>

              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="contact@acme.com"
                required
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
              />
            </div>

            {/* Phone */}

            <div>
              <label
                htmlFor="customerPhone"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Phone number
              </label>

              <input
                id="customerPhone"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
              />
            </div>

            {/* Submit */}

            <div className="md:col-span-3 flex justify-end">

              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-black" />
                    Creating...
                  </span>
                ) : (
                  "Create Lead"
                )}
              </button>

            </div>

          </form>
        </section>
      )}

      {/* =====================================================
          STATS
      ====================================================== */}

      {!loading && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {[
            ["Total leads", leads.length],
            ["New", getCount("new")],
            ["Quoted", getCount("quoted")],
            ["Accepted", getCount("accepted")],
          ].map(([label, value]) => (
            <div
              key={label}
              className="group rounded-2xl border border-white/10 bg-[#050505] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/20"
            >

              <div className="flex items-center justify-between">

                <p className="text-xs text-slate-500">
                  {label}
                </p>

                <span className="h-1.5 w-1.5 rounded-full bg-white/30 transition group-hover:bg-white" />

              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
                {value}
              </p>

              <div className="mt-4 h-px overflow-hidden bg-white/[0.08]">
                <div className="h-full w-1/2 bg-white/40 transition-all duration-500 group-hover:w-full" />
              </div>

            </div>
          ))}

        </div>
      )}

      {/* =====================================================
          LEADS TABLE
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">

        {/* Section header */}

        <div className="border-b border-white/[0.08] px-5 py-5 sm:px-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Activity
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Your leads
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Customers currently moving through your
                pipeline.
              </p>
            </div>

            {!loading && leads.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-slate-600">
                Showing{" "}
                <span className="font-medium text-slate-300">
                  {filteredLeads.length}
                </span>{" "}
                of {leads.length}
              </div>
            )}

          </div>

          {/* Filters */}

          {!loading && leads.length > 0 && (
            <div className="mt-5 flex flex-col gap-3 md:flex-row">

              <div className="relative flex-1">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-700">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search by name, email or phone..."
                  className="w-full rounded-xl border border-white/10 bg-black py-3 pl-10 pr-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-black px-4 py-3 text-sm capitalize text-slate-400 outline-none transition hover:border-white/15 focus:border-white/25"
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="bg-black"
                  >
                    {status === "all"
                      ? "All statuses"
                      : status}
                  </option>
                ))}
              </select>

            </div>
          )}

        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div className="space-y-2 p-5 sm:p-6">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-white/[0.04]"
              />
            ))}

          </div>
        ) : filteredLeads.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================== */

          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg text-slate-600">
              ◎
            </div>

            <h3 className="mt-5 font-semibold text-white">
              {search || statusFilter !== "all"
                ? "No matching leads"
                : "No leads yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              {search || statusFilter !== "all"
                ? "Try changing your search or status filter."
                : "Create your first customer lead to get started."}
            </p>

            {(search || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                Clear filters
              </button>
            )}

          </div>
        ) : (

          /* =================================================
             LEAD ROWS
          ================================================== */

          <div className="divide-y divide-white/[0.07]">

            {filteredLeads.map((lead) => {

              const status = (
                lead.status || "new"
              ).toLowerCase();

              const initial =
                lead.customerName
                  ?.charAt(0)
                  ?.toUpperCase() || "?";

              return (
                <div
                  key={lead._id}
                  className="group flex flex-col gap-5 px-5 py-5 transition duration-200 hover:bg-white/[0.025] sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                >

                  {/* Customer */}

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-sm font-semibold text-slate-400 transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:text-white">
                      {initial}
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-sm font-semibold text-white">
                        {lead.customerName}
                      </h3>

                      <div className="mt-1 flex flex-col gap-1 text-xs text-slate-600 sm:flex-row sm:gap-4">

                        <span className="truncate">
                          {lead.customerEmail}
                        </span>

                        <span>
                          {lead.customerPhone}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Status / action */}

                  <div className="flex items-center justify-between gap-4 pl-[3.75rem] lg:justify-end lg:pl-0">

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] font-medium capitalize tracking-wide ${
                        statusStyles[status] ||
                        "border-white/10 bg-white/[0.04] text-slate-400"
                      }`}
                    >
                      {status}
                    </span>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition group-hover:text-white"
                    >
                      View
                      <span className="transition duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

    </div>
  );
}

export default Leads;