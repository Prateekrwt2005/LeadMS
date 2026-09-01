import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      await api.post(`/products/${productId}/lock`);

      await fetchProducts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to lock product."
      );
    }
  };

  if (loading) {
    return (
      <div>
        <p className="text-sm text-slate-400">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm text-indigo-400">
          Catalog
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          Products
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Browse products available for your sales catalog.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
          <h2 className="font-semibold">
            No products available
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            There are currently no products to display.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product._id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {product.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {product.category || "Product"}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                  Available
                </span>
              </div>

              <p className="mt-5 text-2xl font-bold">
                ₹{product.price}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {product.description || "No description available."}
              </p>

              <button
                type="button"
                onClick={() => handleLock(product._id)}
                className="mt-6 w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-400"
              >
                Lock Product
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;