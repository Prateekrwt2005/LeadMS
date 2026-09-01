import { useEffect, useMemo, useState } from "react";
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
        setLoading(true);
        setError("");

        const response = await api.get("/vendor/profile");

        setForm({
          marginPercentage:
            response.data.marginPercentage ?? "",
          installationPrice:
            response.data.installationPrice ?? "",
          miscCharges:
            response.data.miscCharges ?? "",
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
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
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

  const quotePreview = useMemo(() => {
    const margin = Number(form.marginPercentage) || 0;
    const installation =
      Number(form.installationPrice) || 0;
    const misc = Number(form.miscCharges) || 0;

    const exampleProduct = 10000;

    const marginAmount =
      exampleProduct * (margin / 100);

    return {
      product: exampleProduct,
      margin: marginAmount,
      installation,
      misc,
      total:
        exampleProduct +
        marginAmount +
        installation +
        misc,
    };
  }, [
    form.marginPercentage,
    form.installationPrice,
    form.miscCharges,
  ]);

  /*
   * Shared class for number inputs.
   *
   * appearance-none removes the native number-input UI.
   * The WebKit selectors remove Chrome/Edge spinner arrows.
   */
  const numberInputClass =
    "w-full appearance-none rounded-xl border border-white/10 bg-black py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  if (loading) {
    return (
      <div className="w-full space-y-7 overflow-x-hidden">
        <div className="space-y-3">
          <div className="h-3 w-28 animate-pulse rounded bg-white/10" />

          <div className="h-9 w-56 animate-pulse rounded-lg bg-white/10" />

          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
        </div>

        <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-[#050505]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-7 overflow-x-hidden">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-600">
          Vendor Settings
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Quoting Profile
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Configure the pricing rules used when generating
          customer quotations.
        </p>
      </header>

      {/* =====================================================
          FEEDBACK
      ====================================================== */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-4">
          <p className="text-sm font-medium text-red-300">
            Unable to save changes
          </p>

          <p className="mt-1 text-xs text-red-400/70">
            {error}
          </p>
        </div>
      )}

      {message && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-emerald-300">
              Changes saved
            </p>

            <p className="mt-1 text-xs text-emerald-400/70">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="shrink-0 text-xs text-slate-600 transition hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">

        {/* ===================================================
            SETTINGS FORM
        ==================================================== */}

        <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">

          {/* Card header */}

          <div className="border-b border-white/[0.08] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-slate-400">
                ₹
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Pricing configuration
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  Quote rules
                </h2>
              </div>

            </div>
          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-6"
          >

            <div className="grid gap-5 md:grid-cols-3">

              {/* =================================================
                  MARGIN
              ================================================== */}

              <div className="min-w-0">

                <label
                  htmlFor="marginPercentage"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  Margin percentage
                </label>

                <div className="relative">

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
                    className={`${numberInputClass} pl-4 pr-10`}
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                    %
                  </span>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Profit percentage applied to product pricing.
                </p>

              </div>

              {/* =================================================
                  INSTALLATION
              ================================================== */}

              <div className="min-w-0">

                <label
                  htmlFor="installationPrice"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  Installation
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-600">
                    ₹
                  </span>

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
                    className={`${numberInputClass} pl-9 pr-4`}
                  />

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Fixed installation charge.
                </p>

              </div>

              {/* =================================================
                  MISC CHARGES
              ================================================== */}

              <div className="min-w-0">

                <label
                  htmlFor="miscCharges"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  Misc. charges
                </label>

                <div className="relative">

                  <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-600">
                    ₹
                  </span>

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
                    className={`${numberInputClass} pl-9 pr-4`}
                  />

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Additional fixed charges.
                </p>

              </div>

            </div>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-7 border-t border-white/[0.07]" />

            {/* =================================================
                FORMULA
            ================================================== */}

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">

              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-xs text-slate-500">
                  i
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-medium text-slate-300">
                    Quote calculation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Final customer price = product price +
                    margin + installation + miscellaneous
                    charges.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                SAVE
            ================================================== */}

            <div className="mt-7 flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-w-[140px] items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-black" />

                    Saving...

                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>

            </div>

          </form>

        </section>

        {/* ===================================================
            LIVE PREVIEW
        ==================================================== */}

        <aside className="h-fit min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">

          {/* Preview header */}

          <div className="border-b border-white/[0.08] px-5 py-5">

            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
              Preview
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Example quotation
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Based on a ₹10,000 product.
            </p>

          </div>

          {/* Preview content */}

          <div className="p-5">

            {/* Product */}

            <div className="flex items-center justify-between gap-4 py-3">

              <span className="text-sm text-slate-500">
                Product
              </span>

              <span className="text-sm font-medium text-white">
                ₹
                {quotePreview.product.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* Margin */}

            <div className="flex items-center justify-between gap-4 py-3">

              <div className="min-w-0">

                <span className="text-sm text-slate-500">
                  Margin
                </span>

                <span className="ml-2 text-[10px] text-slate-700">
                  {form.marginPercentage || 0}%
                </span>

              </div>

              <span className="shrink-0 text-sm font-medium text-white">
                ₹
                {quotePreview.margin.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

            {/* Installation */}

            <div className="flex items-center justify-between gap-4 py-3">

              <span className="text-sm text-slate-500">
                Installation
              </span>

              <span className="shrink-0 text-sm font-medium text-white">
                ₹
                {quotePreview.installation.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* Misc */}

            <div className="flex items-center justify-between gap-4 py-3">

              <span className="text-sm text-slate-500">
                Misc. charges
              </span>

              <span className="shrink-0 text-sm font-medium text-white">
                ₹
                {quotePreview.misc.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* Total */}

            <div className="mt-3 border-t border-white/[0.08] pt-5">

              <div className="flex items-end justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                    Final customer price
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    ₹
                    {quotePreview.total.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                </div>

                <span className="mb-1 shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-500">
                  Preview
                </span>

              </div>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default VendorProfile;