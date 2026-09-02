import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage(
        response.data.message ||
          "Password reset successfully. You can now log in."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset your password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-8 text-white sm:px-6">
      <div className="w-full max-w-md">

        <Link
          to="/"
          className="mb-8 block text-center text-2xl font-semibold tracking-tight"
        >
          Lead<span className="text-slate-400">MS</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#050505] p-6 shadow-2xl shadow-black/40 sm:p-8">

          <div className="mb-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
              Account recovery
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Reset password
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create a new password for your LeadMS account.
            </p>
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
              <p className="text-sm leading-5 text-emerald-300">
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="text-sm leading-5 text-red-300">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                New password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs font-medium text-slate-400"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-sm text-white outline-none transition duration-200 placeholder:text-slate-700 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/5"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-black" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

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

        <p className="mt-6 text-center text-[11px] text-slate-700">
          Secure access to your LeadMS workspace
        </p>
      </div>
    </main>
  );
}

export default ResetPassword;