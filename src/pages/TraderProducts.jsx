import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function TraderProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    isActive: true,
  });

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/trader");

      setProducts(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ============================================================
  // CREATE / UPDATE PRODUCT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        basePrice: Number(form.basePrice),
        isActive: form.isActive,
      };

      if (editingId) {
        setUpdating(true);

        await api.put(
          `/products/trader/${editingId}`,
          payload
        );

        setSuccess("Product updated successfully.");
      } else {
        setCreating(true);

        await api.post("/products/trader", payload);

        setSuccess("Product created successfully.");
      }

      // Reset form
      setForm({
        name: "",
        description: "",
        basePrice: "",
        isActive: true,
      });

      setEditingId(null);

      // Refresh products
      await fetchProducts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          (editingId
            ? "Unable to update product."
            : "Unable to create product.")
      );
    } finally {
      setCreating(false);
      setUpdating(false);
    }
  };

  // ============================================================
  // EDIT PRODUCT
  // ============================================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      basePrice: product.basePrice ?? "",
      isActive: Boolean(product.isActive),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // CANCEL EDIT
  // ============================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      basePrice: "",
      isActive: true,
    });

    setError("");
    setSuccess("");
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(productId);
      setError("");
      setSuccess("");

      await api.delete(`/products/trader/${productId}`);

      setSuccess("Product deleted successfully.");

      // If deleting the product currently being edited,
      // cancel edit mode.
      if (editingId === productId) {
        handleCancelEdit();
      }

      await fetchProducts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // SEARCH
  // ============================================================

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

      return (
        name.includes(query) ||
        description.includes(query)
      );
    });
  }, [products, search]);

  const activeCount = products.filter(
    (product) => product.isActive
  ).length;

  return (
    <div className="w-full space-y-7">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Trader Workspace
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Product Catalog
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create and manage the products available to
            vendors across your marketplace.
          </p>
        </div>

        {!loading && (
          <div className="flex gap-3">

            <div className="rounded-xl border border-white/10 bg-[#050505] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                Products
              </p>

              <p className="mt-1 text-xl font-semibold text-white">
                {products.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#050505] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                Active
              </p>

              <p className="mt-1 text-xl font-semibold text-white">
                {activeCount}
              </p>
            </div>

          </div>
        )}

      </header>

      {/* =====================================================
          ERROR
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

      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {success && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-4">

          <div>
            <p className="text-sm font-medium text-emerald-300">
              Success
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
          CREATE / EDIT PRODUCT
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">

        {/* Form header */}

        <div className="border-b border-white/[0.08] px-5 py-5 sm:px-6">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-slate-400">
              {editingId ? "✎" : "+"}
            </div>

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                {editingId
                  ? "Catalog management · Editing"
                  : "Catalog management"}
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                {editingId
                  ? "Edit product"
                  : "Add a product"}
              </h2>

            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
        >

          {/* Product name */}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Product name
            </label>

            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="CRM Software"
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
            />
          </div>

          {/* Price */}

          <div>
            <label
              htmlFor="basePrice"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Base price
            </label>

            <div className="relative">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                ₹
              </span>

              <input
                id="basePrice"
                name="basePrice"
                type="number"
                min="0"
                step="0.01"
                value={form.basePrice}
                onChange={handleChange}
                placeholder="500"
                required
                className="w-full rounded-xl border border-white/10 bg-black py-3.5 pl-9 pr-4 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
              />

            </div>
          </div>

          {/* Description */}

          <div className="md:col-span-2">

            <label
              htmlFor="description"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
            />

          </div>

          {/* Active toggle + buttons */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:col-span-2">

            <label className="flex cursor-pointer items-center gap-3">

              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="peer sr-only"
              />

              <span className="relative h-6 w-11 rounded-full border border-white/10 bg-white/[0.06] transition peer-checked:bg-white peer-focus:ring-2 peer-focus:ring-white/10">
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-slate-500 transition peer-checked:translate-x-5 peer-checked:bg-black" />
              </span>

              <span>
                <span className="block text-sm font-medium text-slate-300">
                  Product is active
                </span>

                <span className="block text-xs text-slate-600">
                  Vendors can see active products
                </span>
              </span>

            </label>

            <div className="flex flex-col gap-3 sm:flex-row">

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={creating || updating}
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating || updating ? (
                  <span className="inline-flex items-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-black" />

                    {editingId
                      ? "Updating..."
                      : "Creating..."}

                  </span>
                ) : (
                  editingId
                    ? "Save Changes"
                    : "Create Product"
                )}
              </button>

            </div>

          </div>

        </form>

      </section>

      {/* =====================================================
          PRODUCT LIST HEADER
      ====================================================== */}

      <section>

        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
              Inventory
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Your products
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Products managed by your trader account.
            </p>

          </div>

          {!loading && products.length > 0 && (
            <div className="flex items-center gap-3">

              <div className="relative">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-700">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-white/10 bg-[#050505] py-2.5 pl-9 pr-4 text-xs text-white outline-none transition placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 sm:w-64"
                />

              </div>

              <button
                type="button"
                onClick={fetchProducts}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white active:scale-95"
              >
                Refresh
              </button>

            </div>
          )}

        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[340px] animate-pulse rounded-2xl border border-white/10 bg-[#050505]"
              />
            ))}

          </div>
        ) : filteredProducts.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================== */

          <div className="rounded-2xl border border-white/10 bg-[#050505] px-6 py-14 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-slate-600">
              ▦
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              {search
                ? "No products found"
                : "No products yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {search
                ? "Try a different product name or description."
                : "Create your first product using the form above."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                Clear search
              </button>
            )}

          </div>

        ) : (

          /* =================================================
             PRODUCTS
          ================================================== */

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {filteredProducts.map((product) => (

              <article
                key={product._id}
                className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#050505] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#080808] hover:shadow-2xl hover:shadow-black"
              >

                {/* Glow */}

                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-white/[0.02] blur-3xl transition duration-500 group-hover:bg-white/[0.06]" />

                {/* Top */}

                <div className="relative flex items-start justify-between gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-slate-400 transition duration-300 group-hover:scale-105 group-hover:border-white/20 group-hover:text-white">
                    P
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-wide ${
                      product.isActive
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                        : "border-white/10 bg-white/[0.03] text-slate-600"
                    }`}
                  >
                    {product.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                {/* Info */}

                <div className="relative mt-6">

                  <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold tracking-tight text-white">
                    {product.name}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                    {product.description ||
                      "No description available."}
                  </p>

                </div>

                {/* Price */}

                <div className="relative mt-auto border-t border-white/[0.08] pt-5">

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
                    Base price
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                    ₹
                    {Number(
                      product.basePrice || 0
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

                {/* Actions */}

                <div className="relative mt-4 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === product._id}
                    onClick={() =>
                      handleDelete(product._id)
                    }
                    className="rounded-xl border border-red-500/20 bg-red-500/[0.03] px-4 py-3 text-xs font-medium text-red-300 transition hover:bg-red-500/[0.08] hover:text-red-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === product._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default TraderProducts;