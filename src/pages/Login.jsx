import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";
import useAuthStore from "../store/authStore";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 const onSubmit = async (formData) => {
  try {
    const response = await api.post("/auth/login", formData);

    login(response.data);

    navigate("/dashboard", {
      replace: true,
    });
  } catch (error) {
    let message = "Unable to sign in. Please try again later.";

    if (error.response?.status === 401) {
      message =
        error.response?.data?.message ||
        "Invalid email or password.";
    } else if (error.response?.status >= 500) {
      message =
        "The server is currently unavailable. Please try again later.";
    } else if (!error.response) {
      message =
        "Unable to connect to the server. Please check your internet connection.";
    }

    setError("root", { message });
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link
          to="/"
          className="mb-10 block text-center text-2xl font-bold tracking-tight"
        >
          Lead<span className="text-indigo-400">MS</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">

          <div className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              Welcome back
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Sign in
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in to continue to your LeadMS workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Registration success */}
            {location.state?.message && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                {location.state.message}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full rounded-lg border bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
              />

              {errors.email && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-400 transition hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={`w-full rounded-lg border bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
              />

              {errors.password && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API error */}
            {errors.root && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errors.root.message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Secure access to your LeadMS workspace
        </p>
      </div>
    </div>
  );
}

export default Login;