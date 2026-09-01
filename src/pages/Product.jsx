import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function Products() {
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
          "Unable to load products."
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
        response.data?.message ||
          "Product locked successfully."
      );

      // Remove locked product from available list
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
      const name =
        product.name?.toLowerCase() || "";

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
    <div className="w-full space-y-7">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Vendor Catalog
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Available Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Browse products from traders and add the products
            you want to offer in your sales catalog.
          </p>
        </div>

        {!loading && (
          <div className="rounded-xl border border-white/10 bg-[#050505] px-5 py-3">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
              Available
            </p>

            <p className="mt-1 text-xl font-semibold text-white">
              {products.length}
            </p>
          </div>
        )}

      </header>

      {/* =====================================================
          FEEDBACK
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
            onClick={fetchProducts}
            className="w-fit rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/10 hover:text-white"
          >
            Try again
          </button>

        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-4">

          <div>
            <p className="text-sm font-medium text-emerald-300">
              Product locked
            </p>

            <p className="mt-1 text-xs text-emerald-400/70">
              {success}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-xs text-slate-600 transition hover:text-white"
          >
            Dismiss
          </button>

        </div>
      )}

      {/* =====================================================
          SEARCH
      ====================================================== */}

      {!loading && products.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="w-full rounded-xl border border-white/10 bg-[#050505] py-3 pl-10 pr-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
            />

          </div>

          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-400 transition duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh
          </button>

        </div>
      )}

      {/* Search count */}

      {!loading &&
        search &&
        filteredProducts.length > 0 && (
          <p className="text-xs text-slate-600">
            Showing{" "}
            <span className="font-medium text-slate-300">
              {filteredProducts.length}
            </span>{" "}
            matching products
          </p>
        )}

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-[390px] animate-pulse rounded-2xl border border-white/10 bg-[#050505]"
            />
          ))}

        </div>
      ) : filteredProducts.length === 0 ? (

        /* ===================================================
           EMPTY
        ==================================================== */

        <div className="rounded-2xl border border-white/10 bg-[#050505] px-6 py-16 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-slate-600">
            ◈
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            {search
              ? "No products found"
              : "No products available"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            {search
              ? "Try a different product name, category, or search term."
              : "There are currently no active products available from traders."}
          </p>

          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Clear search
            </button>
          ) : (
            <button
              type="button"
              onClick={fetchProducts}
              className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Refresh
            </button>
          )}

        </div>
      ) : (

        /* ===================================================
           PRODUCTS
        ==================================================== */

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {filteredProducts.map((product) => {

            const isLocking =
              lockingId === product._id;

            return (
              <article
                key={product._id}
                className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#050505] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#080808] hover:shadow-2xl hover:shadow-black"
              >

                {/* Hover glow */}

                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/[0.02] blur-3xl transition duration-500 group-hover:bg-white/[0.06]" />

                {/* =================================================
                    TOP
                ================================================== */}

                <div className="relative flex items-start justify-between gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-slate-400 transition duration-300 group-hover:scale-105 group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:text-white">
                    P
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    Available
                  </span>

                </div>

                {/* =================================================
                    PRODUCT INFO
                ================================================== */}

                <div className="relative mt-6">

                  <h2 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold tracking-tight text-white">
                    {product.name}
                  </h2>

                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-600">
                    {product.category || "Product"}
                  </p>

                  <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-500">
                    {product.description ||
                      "No description available."}
                  </p>

                </div>

                {/* =================================================
                    PRICE
                ================================================== */}

                <div className="relative mt-auto border-t border-white/[0.08] pt-5">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    Base price
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                    ₹
                    {Number(
                      product.basePrice ??
                        product.price ??
                        0
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

                {/* =================================================
                    LOCK
                ================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    handleLock(product._id)
                  }
                  disabled={isLocking}
                  className="relative mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLocking ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-black" />
                      Locking...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Lock Product
                      <span className="transition duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  )}
                </button>

              </article>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Products;