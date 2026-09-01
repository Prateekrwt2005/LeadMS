import { useEffect, useState } from "react";
import api from "../services/api";

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
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

  if (loading) {
    return <p className="text-sm text-slate-400">Loading analytics...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error}
      </div>
    );
  }

  const stats = [
    ["Users", analytics?.userCount ?? 0],
    ["Leads", analytics?.leadCount ?? 0],
    ["Products", analytics?.productCount ?? 0],
    ["Revenue", `₹${analytics?.revenue ?? 0}`],
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-indigo-400">Administration</p>

        <h1 className="mt-1 text-3xl font-bold">
          Platform Analytics
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Monitor overall LeadMS platform activity.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAnalytics;