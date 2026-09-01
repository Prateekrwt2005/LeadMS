import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../services/api";

const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: z.enum(["vendor", "trader"]),
});

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "vendor",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (formData) => {
    try {
      await api.post("/auth/register", formData);

      navigate("/login", {
        state: {
          message:
            "Account created successfully. Please check your email to verify your account.",
        },
      });
    } catch (error) {
      setError("root", {
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-lg">

        {/* Logo */}
        <Link
          to="/"
          className="mb-8 block text-center text-2xl font-bold tracking-tight"
        >
          Lead<span className="text-indigo-400">MS</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">

          <div className="mb-8">
            <p className="text-sm font-medium text-indigo-400">
              Get started
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Choose your role and start managing your LeadMS workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium"
                >
                  First name
                </label>

                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  {...register("firstName")}
                  className={`w-full rounded-lg border bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:ring-2 ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />

                {errors.firstName && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium"
                >
                  Last name
                </label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  {...register("lastName")}
                  className={`w-full rounded-lg border bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:ring-2 ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />

                {errors.lastName && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full rounded-lg border bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:ring-2 ${
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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                {...register("password")}
                className={`w-full rounded-lg border bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:ring-2 ${
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

              <p className="mt-2 text-xs text-slate-600">
                Minimum 6 characters
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="mb-3 text-sm font-medium">
                Choose your role
              </p>

              <div className="grid grid-cols-2 gap-4">

                {/* Vendor */}
                <label
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    selectedRole === "vendor"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-700 bg-slate-950 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    value="vendor"
                    {...register("role")}
                    className="sr-only"
                  />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Vendor
                    </span>

                    {selectedRole === "vendor" && (
                      <span className="text-indigo-400">
                        ✓
                      </span>
                    )}
                  </div>

                  <span className="mt-2 block text-xs leading-5 text-slate-400">
                    Manage leads, products and sales.
                  </span>
                </label>

                {/* Trader */}
                <label
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    selectedRole === "trader"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-700 bg-slate-950 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    value="trader"
                    {...register("role")}
                    className="sr-only"
                  />

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Trader
                    </span>

                    {selectedRole === "trader" && (
                      <span className="text-indigo-400">
                        ✓
                      </span>
                    )}
                  </div>

                  <span className="mt-2 block text-xs leading-5 text-slate-400">
                    Manage your product catalog.
                  </span>
                </label>
              </div>
            </div>

            {/* API Error */}
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
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          You'll receive an email to verify your account.
        </p>
      </div>
    </div>
  );
}

export default Register;