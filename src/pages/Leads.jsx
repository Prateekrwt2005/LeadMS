import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";

const statusStyles = {
  new: "bg-blue-500/10 text-blue-400",
  contacted: "bg-amber-500/10 text-amber-400",
  quoted: "bg-indigo-500/10 text-indigo-400",
  accepted: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
};

const statuses = [
  "all",
  "new",
  "contacted",
  "quoted",
  "accepted",
  "rejected",
];

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

  // Prevent duplicate requests
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">
            Sales Pipeline
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Leads
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Manage customer inquiries and track their
            progress through your sales pipeline.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-400"
        >
          {showForm ? "Cancel" : "+ New Lead"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchLeads}
            className="w-fit font-medium text-red-300 hover:text-white"
          >
            Try again
          </button>
        </div>
      )}

      {/* Create lead */}
      {showForm && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Create new lead
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a customer to your sales pipeline.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-3"
          >
            <div>
              <label
                htmlFor="customerName"
                className="mb-2 block text-sm font-medium text-slate-300"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="customerEmail"
                className="mb-2 block text-sm font-medium text-slate-300"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="customerPhone"
                className="mb-2 block text-sm font-medium text-slate-300"
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
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating
                  ? "Creating..."
                  : "Create Lead"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-500">
              Total leads
            </p>

            <p className="mt-2 text-2xl font-bold">
              {leads.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-500">
              New
            </p>

            <p className="mt-2 text-2xl font-bold">
              {
                leads.filter(
                  (lead) =>
                    (lead.status || "new").toLowerCase() ===
                    "new"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-500">
              Quoted
            </p>

            <p className="mt-2 text-2xl font-bold">
              {
                leads.filter(
                  (lead) =>
                    lead.status?.toLowerCase() === "quoted"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-500">
              Accepted
            </p>

            <p className="mt-2 text-2xl font-bold">
              {
                leads.filter(
                  (lead) =>
                    lead.status?.toLowerCase() ===
                    "accepted"
                ).length
              }
            </p>
          </div>
        </div>
      )}

      {/* Leads */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60">

        {/* Section header */}
        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">
                Your leads
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Customers currently moving through your
                pipeline
              </p>
            </div>

            {!loading && leads.length > 0 && (
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="text-slate-300">
                  {filteredLeads.length}
                </span>{" "}
                of {leads.length}
              </p>
            )}
          </div>

          {/* Filters */}
          {!loading && leads.length > 0 && (
            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name, email or phone..."
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm capitalize text-slate-300 outline-none focus:border-indigo-500"
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="bg-slate-950"
                  >
                    {status === "all"
                      ? "All statuses"
                      : status}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={fetchLeads}
                disabled={loading}
                className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-slate-800"
              />
            ))}

            <p className="pt-3 text-center text-xs text-slate-500">
              Loading leads...
            </p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
              ◎
            </div>

            <h3 className="mt-5 font-semibold">
              {search || statusFilter !== "all"
                ? "No matching leads"
                : "No leads yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
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
                className="mt-5 text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredLeads.map((lead) => {
              const status = (
                lead.status || "new"
              ).toLowerCase();

              return (
                <div
                  key={lead._id}
                  className="group flex flex-col gap-5 px-6 py-5 transition hover:bg-slate-900 lg:flex-row lg:items-center lg:justify-between"
                >
                  {/* Customer */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                        {lead.customerName
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {lead.customerName}
                        </h3>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>
                            {lead.customerEmail}
                          </span>

                          <span>
                            {lead.customerPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status / Action */}
                  <div className="flex items-center gap-4 pl-13 lg:pl-0">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                        statusStyles[status] ||
                        "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {status}
                    </span>

                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
                    >
                      View
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