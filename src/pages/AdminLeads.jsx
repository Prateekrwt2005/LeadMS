import { useEffect, useState } from "react";
import api from "../services/api";

const statusStyles = {
  new: "border-white/[0.10] bg-white/[0.04] text-neutral-300",
  contacted: "border-white/[0.10] bg-white/[0.06] text-neutral-300",
  quoted: "border-white/[0.14] bg-white/[0.08] text-white",
  accepted: "border-white/[0.16] bg-white/[0.10] text-white",
  rejected: "border-red-500/20 bg-red-500/[0.06] text-red-400",
};

function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/leads");

        setLeads(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load leads."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
            All Leads
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Monitor leads across the entire LeadMS platform.
          </p>

        </div>


        {/* Count */}
        {!loading && !error && (
          <div className="w-fit rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">

            <p className="text-[10px] uppercase tracking-wider text-neutral-600">
              Total leads
            </p>

            <p className="mt-0.5 text-lg font-semibold text-white">
              {leads.length}
            </p>

          </div>
        )}

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-sm text-red-400">
              !
            </div>

            <div>

              <p className="text-sm font-medium text-red-400">
                Unable to load leads
              </p>

              <p className="mt-1 text-xs leading-5 text-red-400/70">
                {error}
              </p>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          TABLE
      ===================================================== */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808]">

        {/* Table header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">

          <div>

            <h2 className="text-sm font-semibold text-white">
              Lead activity
            </h2>

            <p className="mt-1 text-xs text-neutral-600">
              Customer inquiries across the platform.
            </p>

          </div>

          {!loading && (
            <span className="hidden text-xs text-neutral-600 sm:block">
              {leads.length} {leads.length === 1 ? "lead" : "leads"}
            </span>
          )}

        </div>


        {/* =================================================
            LOADING
        ================================================= */}
        {loading ? (

          <div className="p-6">

            <div className="space-y-4">

              {[1, 2, 3, 4, 5].map((item) => (

                <div
                  key={item}
                  className="flex animate-pulse items-center gap-5"
                >

                  <div className="h-10 w-10 rounded-full bg-white/[0.05]" />

                  <div className="flex-1 space-y-2">

                    <div className="h-3 w-32 rounded bg-white/[0.06]" />

                    <div className="h-2.5 w-48 rounded bg-white/[0.04]" />

                  </div>

                  <div className="hidden h-6 w-20 rounded-full bg-white/[0.05] sm:block" />

                  <div className="hidden h-3 w-20 rounded bg-white/[0.04] md:block" />

                </div>

              ))}

            </div>

          </div>


        ) : leads.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */
          <div className="p-14 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-neutral-600">
              ◎
            </div>

            <h3 className="mt-5 text-sm font-semibold text-white">
              No leads found
            </h3>

            <p className="mt-2 text-xs text-neutral-600">
              There are currently no leads on the platform.
            </p>

          </div>


        ) : (

          /* =================================================
             DATA TABLE
          ================================================= */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px] text-left">

              <thead className="border-b border-white/[0.07]">

                <tr className="text-[10px] uppercase tracking-wider text-neutral-600">

                  <th className="px-6 py-4 font-medium">
                    Customer
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Contact
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Created
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-white/[0.06]">

                {leads.map((lead) => {

                  const status =
                    lead.status || "new";

                  return (

                    <tr
                      key={lead._id}
                      className="group transition-colors hover:bg-white/[0.025]"
                    >

                      {/* =========================
                          CUSTOMER
                      ========================= */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-neutral-400 transition group-hover:border-white/[0.14] group-hover:text-white">
                            {lead.customerName
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>

                          <div>

                            <p className="text-sm font-medium text-white">
                              {lead.customerName || "Unknown"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-neutral-700">
                              Lead
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* =========================
                          CONTACT
                      ========================= */}
                      <td className="px-6 py-5">

                        {lead.customerEmail && (
                          <p className="text-sm text-neutral-400">
                            {lead.customerEmail}
                          </p>
                        )}

                        {lead.customerPhone && (
                          <p className="mt-1 text-xs text-neutral-600">
                            {lead.customerPhone}
                          </p>
                        )}

                        {!lead.customerEmail &&
                          !lead.customerPhone && (
                            <span className="text-xs text-neutral-700">
                              No contact details
                            </span>
                          )}

                      </td>


                      {/* =========================
                          STATUS
                      ========================= */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium capitalize ${
                            statusStyles[status] ||
                            "border-white/[0.08] bg-white/[0.03] text-neutral-500"
                          }`}
                        >
                          {status}
                        </span>

                      </td>


                      {/* =========================
                          CREATED
                      ========================= */}
                      <td className="px-6 py-5 text-sm text-neutral-600">

                        {lead.createdAt
                          ? new Date(
                              lead.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminLeads;