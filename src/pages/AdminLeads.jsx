import { useEffect, useState } from "react";
import api from "../services/api";

const statusStyles = {
  new: "bg-blue-500/10 text-blue-400",
  contacted: "bg-amber-500/10 text-amber-400",
  quoted: "bg-indigo-500/10 text-indigo-400",
  accepted: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
};

function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
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
      <div>
        <p className="text-sm text-indigo-400">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          All Leads
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Monitor leads across the entire platform.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        {loading ? (
          <div className="p-6 text-sm text-slate-400">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Contact
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => {
                  const status = lead.status || "new";

                  return (
                    <tr
                      key={lead._id}
                      className="transition hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium">
                          {lead.customerName}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300">
                          {lead.customerEmail}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {lead.customerPhone}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            statusStyles[status] ||
                            "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {lead.createdAt
                          ? new Date(
                              lead.createdAt
                            ).toLocaleDateString()
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