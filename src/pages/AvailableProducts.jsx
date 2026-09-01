import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function AvailableProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lockingId, setLockingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/available");

      setProducts(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load available products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLock = async (productId) => {
    try {
      setLockingId(productId);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/products/${productId}/lock`
      );

      setSuccess(
        response.data.message ||
          "Product locked successfully."
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to lock product."
      );
    } finally {
      setLockingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const description =
        product.description?.toLowerCase() || "";
      const category =
        product.category?.toLowerCase() || "";

      return (
        name.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [products, search]);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-400">
            Vendor Catalog
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Available Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Browse products from traders and lock the products
            you want to offer in your sales catalog.
          </p>
        </div>

        {!loading && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
            <p className="text-xs text-slate-500">
              Available products
            </p>

            <p className="mt-1 text-xl font-bold">
              {products.length}
            </p>
          </div>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchProducts}
            className="w-fit font-medium text-red-300 hover:text-white"
          >
            Try again
          </button>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      )}

      {/* Search */}
      {!loading && products.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-xl text-slate-500">
            ▦
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            {search
              ? "No products found"
              : "No products available"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {search
              ? "Try a different product name, category, or search term."
              : "There are currently no active products from traders."}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {search && (
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-300">
                {filteredProducts.length}
              </span>{" "}
              matching products
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product._id}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
              >

                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400">
                    P
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    Available
                  </span>
                </div>

                {/* Product info */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold">
                    {product.name}
                  </h2>

                  {product.category && (
                    <p className="mt-1 text-xs text-indigo-400">
                      {product.category}
                    </p>
                  )}

                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                    {product.description ||
                      "No description available."}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-6 border-t border-slate-800 pt-5">
                  <p className="text-xs text-slate-500">
                    Base price
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-tight">
                    ₹
                    {Number(
                      product.basePrice || 0
                    ).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Action */}
                <button
                  type="button"
                  onClick={() =>
                    handleLock(product._id)
                  }
                  disabled={lockingId === product._id}
                  className="mt-6 w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {lockingId === product._id
                    ? "Locking..."
                    : "Lock Product"}
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AvailableProducts;