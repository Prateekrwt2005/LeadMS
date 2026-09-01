import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(
        response.data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-white sm:px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link
          to="/"
          className="mb-8 block text-center text-2xl font-semibold tracking-tight"
        >
          Lead<span className="text-slate-400">MS</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#050505] p-6 shadow-2xl shadow-black/40 sm:p-8">

          {/* Header */}
          <div className="mb-8">

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
              Account recovery
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Forgot password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your email address and we'll send you a
              password reset link.
            </p>

          </div>

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
              <div className="flex gap-3">

                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 text-[10px] text-emerald-400">
                  ✓
                </div>

                <p className="text-sm leading-5 text-emerald-300">
                  {message}
                </p>

              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <div className="flex gap-3">

                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-400/30 text-[10px] text-red-400">
                  !
                </div>

                <p className="text-sm leading-5 text-red-300">
                  {error}
                </p>

              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
              />

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-black" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>

          </form>

          {/* Back */}
          <div className="mt-7 border-t border-white/[0.07] pt-6 text-center">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
            >
              <span>←</span>
              Back to Login
            </Link>

          </div>

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-slate-700">
          Secure access to your LeadMS workspace
        </p>

      </div>
    </main>
  );
}

export default ForgotPassword;