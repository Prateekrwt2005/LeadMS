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
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
            Vendor Catalog
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
            Available Products
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Browse products from traders and lock the products
            you want to offer in your sales catalog.
          </p>

        </div>


        {/* Product count */}
        {!loading && (
          <div className="w-fit rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">

            <p className="text-[10px] uppercase tracking-wider text-neutral-600">
              Available products
            </p>

            <p className="mt-0.5 text-lg font-semibold text-white">
              {products.length}
            </p>

          </div>
        )}

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-sm text-red-400">
              !
            </div>

            <div>

              <p className="text-sm font-medium text-red-400">
                Something went wrong
              </p>

              <p className="mt-1 text-xs text-red-400/70">
                {error}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={fetchProducts}
            className="w-fit text-xs font-medium text-red-300 transition hover:text-white"
          >
            Try again →
          </button>

        </div>
      )}


      {/* =====================================================
          SUCCESS
      ===================================================== */}
      {success && (
        <div className="rounded-2xl border border-white/[0.10] bg-white/[0.04] px-4 py-3.5">

          <div className="flex items-center gap-3">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
              ✓
            </div>

            <p className="text-sm text-neutral-300">
              {success}
            </p>

          </div>

        </div>
      )}


      {/* =====================================================
          SEARCH
      ===================================================== */}
      {!loading && products.length > 0 && (

        <div className="flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-600">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="w-full rounded-xl border border-white/[0.10] bg-[#080808] py-3.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-700 focus:border-white/30 focus:ring-2 focus:ring-white/[0.06]"
            />

          </div>


          <button
            type="button"
            onClick={fetchProducts}
            className="rounded-xl border border-white/[0.10] bg-[#080808] px-5 py-3.5 text-sm font-medium text-neutral-400 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
          >
            Refresh
          </button>

        </div>
      )}


      {/* =====================================================
          SEARCH RESULT COUNT
      ===================================================== */}
      {!loading &&
        search &&
        products.length > 0 && (
          <p className="text-xs text-neutral-600">

            Showing{" "}

            <span className="font-medium text-neutral-300">
              {filteredProducts.length}
            </span>

            {" "}matching{" "}

            {filteredProducts.length === 1
              ? "product"
              : "products"}

          </p>
        )}


      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading ? (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3, 4, 5, 6].map(
            (item) => (

              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.025]"
              />

            )
          )}

        </div>


      ) : filteredProducts.length === 0 ? (

        /* =================================================
           EMPTY STATE
        ================================================= */
        <div className="rounded-2xl border border-white/[0.08] bg-[#080808] p-14 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-neutral-600">
            ▦
          </div>

          <h2 className="mt-5 text-sm font-semibold text-white">
            {search
              ? "No products found"
              : "No products available"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-neutral-600">
            {search
              ? "Try a different product name, category, or search term."
              : "There are currently no active products from traders."}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 text-xs font-medium text-neutral-400 transition hover:text-white"
            >
              Clear search →
            </button>
          )}

        </div>


      ) : (

        /* =================================================
           PRODUCTS
        ================================================= */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredProducts.map((product) => (

            <article
              key={product._id}
              className="group flex flex-col rounded-2xl border border-white/[0.08] bg-[#080808] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.17] hover:bg-[#0b0b0b]"
            >

              {/* =================================================
                  TOP
              ================================================= */}
              <div className="flex items-start justify-between gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm font-semibold text-neutral-400 transition group-hover:border-white/[0.16] group-hover:text-white">
                  P
                </div>

                <span className="rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1 text-[10px] font-medium text-neutral-400">
                  Available
                </span>

              </div>


              {/* =================================================
                  PRODUCT INFO
              ================================================= */}
              <div className="mt-6">

                <h2 className="text-lg font-semibold text-white">
                  {product.name}
                </h2>

                {product.category && (
                  <p className="mt-1 text-xs text-neutral-600">
                    {product.category}
                  </p>
                )}

                <p className="mt-3 min-h-12 text-sm leading-6 text-neutral-500">
                  {product.description ||
                    "No description available."}
                </p>

              </div>


              {/* =================================================
                  PRICE
              ================================================= */}
              <div className="mt-6 border-t border-white/[0.07] pt-5">

                <p className="text-[10px] uppercase tracking-wider text-neutral-600">
                  Base price
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">
                  ₹
                  {Number(
                    product.basePrice || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>


              {/* =================================================
                  ACTION
              ================================================= */}
              <button
                type="button"
                onClick={() =>
                  handleLock(product._id)
                }
                disabled={
                  lockingId === product._id
                }
                className="group/button mt-6 flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {lockingId === product._id ? (
                  <span className="flex items-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />

                    Locking...

                  </span>
                ) : (
                  <>
                    Lock Product

                    <span className="ml-2 transition-transform group-hover/button:translate-x-1">
                      →
                    </span>
                  </>
                )}

              </button>

            </article>

          ))}

        </div>

      )}

    </div>
  );
}

export default AvailableProducts;