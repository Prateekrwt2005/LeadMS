import { useEffect, useState } from "react";
import api from "../services/api";

function TraderProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    isActive: true,
  });

  const [creating, setCreating] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");

      await api.post("/products/trader", {
        name: form.name,
        description: form.description,
        basePrice: Number(form.basePrice),
        isActive: form.isActive,
      });

      setForm({
        name: "",
        description: "",
        basePrice: "",
        isActive: true,
      });

      await fetchProducts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create product."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm text-indigo-400">
          Trader
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Product Catalog
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Create and manage your products.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Create product */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold">
          Add a product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-5 md:grid-cols-2"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm text-slate-300"
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="basePrice"
              className="mb-2 block text-sm text-slate-300"
            >
              Base price
            </label>

            <input
              id="basePrice"
              name="basePrice"
              type="number"
              min="0"
              value={form.basePrice}
              onChange={handleChange}
              placeholder="500"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm text-slate-300"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enterprise CRM"
              rows="3"
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Product is active
          </label>

          <div className="md:text-right">
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </section>

      {/* Product list */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Your products
            </h2>

            <p className="text-sm text-slate-500">
              Products managed by your account
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {products.length} products
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <p className="text-slate-400">
              No products yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      product.isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold">
                  ₹{product.basePrice}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {product.description || "No description"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TraderProducts;