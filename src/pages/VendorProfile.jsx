import { useEffect, useState } from "react";
import api from "../services/api";

function VendorProfile() {
  const [form, setForm] = useState({
    marginPercentage: "",
    installationPrice: "",
    miscCharges: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/vendor/profile");

        setForm({
          marginPercentage: response.data.marginPercentage ?? "",
          installationPrice: response.data.installationPrice ?? "",
          miscCharges: response.data.miscCharges ?? "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load vendor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put("/vendor/profile", {
        marginPercentage: Number(form.marginPercentage),
        installationPrice: Number(form.installationPrice),
        miscCharges: Number(form.miscCharges),
      });

      setMessage(
        response.data.message ||
          "Quoting profile updated successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update quoting profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-800" />
        <div className="h-72 animate-pulse rounded-2xl bg-slate-900" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <p className="text-sm text-indigo-400">
          Vendor Settings
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Quoting Profile
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Configure the pricing rules used when generating customer quotes.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
      >
        <div className="grid gap-6 md:grid-cols-3">

          <div>
            <label
              htmlFor="marginPercentage"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Margin %
            </label>

            <input
              id="marginPercentage"
              name="marginPercentage"
              type="number"
              min="0"
              step="0.01"
              value={form.marginPercentage}
              onChange={handleChange}
              placeholder="10"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Profit percentage applied to product pricing.
            </p>
          </div>

          <div>
            <label
              htmlFor="installationPrice"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Installation
            </label>

            <input
              id="installationPrice"
              name="installationPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.installationPrice}
              onChange={handleChange}
              placeholder="500"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Fixed installation charge.
            </p>
          </div>

          <div>
            <label
              htmlFor="miscCharges"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Misc. Charges
            </label>

            <input
              id="miscCharges"
              name="miscCharges"
              type="number"
              min="0"
              step="0.01"
              value={form.miscCharges}
              onChange={handleChange}
              placeholder="250"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Additional fixed charges.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VendorProfile;