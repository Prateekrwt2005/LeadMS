import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Quotes() {
  const [leads, setLeads] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [quote, setQuote] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [leadsResponse, productsResponse] =
        await Promise.all([
          api.get("/leads"),
          api.get("/products/locked"),
        ]);

      setLeads(leadsResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load quote data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    const value = Math.max(0, Number(quantity) || 0);

    setSelectedProducts((current) => ({
      ...current,
      [productId]: value,
    }));

    setQuote(null);
    setSuccess("");
  };

  const selectedProductCount = useMemo(() => {
    return Object.values(selectedProducts).filter(
      (quantity) => quantity > 0
    ).length;
  }, [selectedProducts]);

  const estimatedSubtotal = useMemo(() => {
    return products.reduce((total, product) => {
      const quantity =
        selectedProducts[product._id] || 0;

      return (
        total +
        Number(product.basePrice || 0) * quantity
      );
    }, 0);
  }, [products, selectedProducts]);

  const handleGenerateQuote = async () => {
    setError("");
    setSuccess("");

    if (!selectedLead) {
      setError("Please select a lead first.");
      return;
    }

    const productsForQuote = Object.entries(
      selectedProducts
    )
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

    if (productsForQuote.length === 0) {
      setError("Please select at least one product.");
      return;
    }

    try {
      setGenerating(true);
      setQuote(null);

      const response = await api.post(
        `/leads/${selectedLead._id}/quote`,
        {
          products: productsForQuote,
        }
      );

      setQuote(response.data.quote);

      setLeads((current) =>
        current.map((lead) =>
          lead._id === selectedLead._id
            ? response.data
            : lead
        )
      );

      setSuccess("Quote generated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to generate quote."
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800" />

        <div className="grid gap-6 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[500px] animate-pulse rounded-2xl bg-slate-900"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">
            Sales
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Quotes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Build customized quotes for your customer
            leads using your locked products.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {/* Progress */}
      <div className="grid gap-3 sm:grid-cols-3">

        <div
          className={`rounded-xl border p-4 ${
            selectedLead
              ? "border-indigo-500/40 bg-indigo-500/10"
              : "border-slate-800 bg-slate-900/60"
          }`}
        >
          <p className="text-xs text-slate-500">
            Step 1
          </p>

          <p className="mt-1 text-sm font-semibold">
            Select Lead
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {selectedLead
              ? selectedLead.customerName
              : "Not selected"}
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 ${
            selectedProductCount > 0
              ? "border-indigo-500/40 bg-indigo-500/10"
              : "border-slate-800 bg-slate-900/60"
          }`}
        >
          <p className="text-xs text-slate-500">
            Step 2
          </p>

          <p className="mt-1 text-sm font-semibold">
            Select Products
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {selectedProductCount} selected
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 ${
            quote
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-slate-800 bg-slate-900/60"
          }`}
        >
          <p className="text-xs text-slate-500">
            Step 3
          </p>

          <p className="mt-1 text-sm font-semibold">
            Quote Preview
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {quote ? "Generated" : "Waiting"}
          </p>
        </div>

      </div>

      {/* Main */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Leads */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60">

          <div className="border-b border-slate-800 px-5 py-5">
            <p className="text-xs font-medium text-indigo-400">
              STEP 1
            </p>

            <h2 className="mt-1 font-semibold">
              Select Lead
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Choose the customer receiving this quote.
            </p>
          </div>

          <div className="max-h-[550px] space-y-2 overflow-y-auto p-4">

            {leads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No leads available.
                </p>
              </div>
            ) : (
              leads.map((lead) => (
                <button
                  key={lead._id}
                  type="button"
                  onClick={() => {
                    setSelectedLead(lead);
                    setQuote(null);
                    setSuccess("");
                    setError("");
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedLead?._id === lead._id
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-800 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {lead.customerName}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {lead.customerEmail}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-800 px-2.5 py-1 text-[10px] capitalize text-slate-400">
                      {lead.status || "new"}
                    </span>

                  </div>
                </button>
              ))
            )}

          </div>
        </section>

        {/* Products */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60">

          <div className="border-b border-slate-800 px-5 py-5">
            <p className="text-xs font-medium text-indigo-400">
              STEP 2
            </p>

            <h2 className="mt-1 font-semibold">
              Select Products
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Choose products and enter quantities.
            </p>
          </div>

          <div className="max-h-[550px] space-y-3 overflow-y-auto p-4">

            {products.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No locked products available.
                </p>
              </div>
            ) : (
              products.map((product) => {
                const quantity =
                  selectedProducts[product._id] || 0;

                return (
                  <div
                    key={product._id}
                    className={`rounded-xl border p-4 transition ${
                      quantity > 0
                        ? "border-indigo-500/40 bg-indigo-500/5"
                        : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatCurrency(
                            product.basePrice
                          )}{" "}
                          / unit
                        </p>
                      </div>

                      <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product._id,
                            e.target.value
                          )
                        }
                        className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-center text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />

                    </div>

                    {quantity > 0 && (
                      <div className="mt-3 flex justify-between border-t border-slate-800 pt-3 text-xs">

                        <span className="text-slate-500">
                          {quantity} ×{" "}
                          {formatCurrency(
                            product.basePrice
                          )}
                        </span>

                        <span className="font-medium text-slate-300">
                          {formatCurrency(
                            Number(
                              product.basePrice || 0
                            ) * quantity
                          )}
                        </span>

                      </div>
                    )}

                  </div>
                );
              })
            )}

          </div>

          {/* Estimate */}
          <div className="border-t border-slate-800 p-5">

            <div className="flex items-center justify-between">

              <span className="text-sm text-slate-400">
                Estimated subtotal
              </span>

              <span className="font-semibold">
                {formatCurrency(estimatedSubtotal)}
              </span>

            </div>

            <button
              type="button"
              onClick={handleGenerateQuote}
              disabled={
                generating ||
                !selectedLead ||
                selectedProductCount === 0
              }
              className="mt-4 w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? "Generating..."
                : "Generate Quote"}
            </button>

          </div>

        </section>

        {/* Preview */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60">

          <div className="border-b border-slate-800 px-5 py-5">
            <p className="text-xs font-medium text-indigo-400">
              STEP 3
            </p>

            <h2 className="mt-1 font-semibold">
              Quote Preview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Review the generated customer pricing.
            </p>
          </div>

          {!quote ? (
            <div className="flex min-h-[400px] items-center justify-center p-8 text-center">
              <div>

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                  ₹
                </div>

                <p className="mt-5 font-medium">
                  No quote generated
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select a lead and at least one product,
                  then generate a quote.
                </p>

              </div>
            </div>
          ) : (
            <div className="space-y-6 p-5">

              {/* Customer */}
              <div>
                <p className="text-xs text-slate-500">
                  Customer
                </p>

                <p className="mt-1 font-semibold">
                  {selectedLead?.customerName}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedLead?.customerEmail}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-4 border-y border-slate-800 py-5">

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Subtotal
                  </span>

                  <span>
                    {formatCurrency(
                      quote.baseTotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Margin
                  </span>

                  <span>
                    {formatCurrency(
                      quote.marginApplied
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Installation
                  </span>

                  <span>
                    {formatCurrency(
                      quote.installationPrice
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    Misc. charges
                  </span>

                  <span>
                    {formatCurrency(
                      quote.miscCharges
                    )}
                  </span>
                </div>

              </div>

              {/* Total */}
              <div className="rounded-2xl bg-indigo-500/10 p-5">

                <p className="text-xs font-medium text-indigo-300">
                  Final customer price
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {formatCurrency(
                    quote.finalTotal ??
                      quote.total
                  )}
                </p>

              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                <p className="text-xs text-emerald-400">
                  Quote generated successfully
                </p>
              </div>

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default Quotes;