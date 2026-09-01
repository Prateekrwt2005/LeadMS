import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
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

/* =========================================================
   AUTH LOADING OVERLAY
========================================================= */

function AuthLoadingOverlay({ type = "login" }) {
  const isRegister = type === "register";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/90 px-6 backdrop-blur-xl"
      style={{
        animation: "authOverlayIn 300ms ease-out forwards",
      }}
    >
      {/* Background glow */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-[100px]"
          style={{
            animation: "authGlow 3s ease-in-out infinite",
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]"
          style={{
            animation: "authPulse 2.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}

      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          animation:
            "authContentIn 500ms cubic-bezier(.16,1,.3,1) forwards",
        }}
      >
        {/* Animated logo */}

        <div className="relative flex h-24 w-24 items-center justify-center">

          {/* Outer ring */}

          <div
            className="absolute inset-0 rounded-[28px] border border-white/[0.10]"
            style={{
              animation:
                "authRing 2s ease-in-out infinite",
            }}
          />

          {/* Middle ring */}

          <div
            className="absolute inset-2 rounded-[25px] border border-white/[0.06]"
            style={{
              animation:
                "authRing 2s ease-in-out infinite 350ms",
            }}
          />

          {/* Inner ring */}

          <div
            className="absolute inset-4 rounded-[20px] border border-white/[0.04]"
            style={{
              animation:
                "authRing 2s ease-in-out infinite 700ms",
            }}
          />

          {/* Logo */}

          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.05] shadow-2xl shadow-black"
            style={{
              animation:
                "authLogo 1.8s ease-in-out infinite",
            }}
          >
            <span className="text-xl font-bold tracking-tight text-white">
              Lead<span className="text-neutral-400">MS</span>
            </span>
          </div>
        </div>

        {/* Heading */}

        <h2 className="mt-8 text-xl font-semibold tracking-tight text-white">
          {isRegister
            ? "Creating your account"
            : "Signing you in"}
        </h2>

        {/* Description */}

        <p className="mt-2 text-sm text-neutral-500">
          {isRegister
            ? "Setting up your LeadMS workspace"
            : "Securely connecting to your workspace"}
        </p>

        {/* Loading dots */}

        <div className="mt-7 flex items-center gap-1.5">

          <span
            className="h-1.5 w-1.5 rounded-full bg-white"
            style={{
              animation:
                "authDot 1.4s ease-in-out infinite",
            }}
          />

          <span
            className="h-1.5 w-1.5 rounded-full bg-white"
            style={{
              animation:
                "authDot 1.4s ease-in-out infinite 180ms",
            }}
          />

          <span
            className="h-1.5 w-1.5 rounded-full bg-white"
            style={{
              animation:
                "authDot 1.4s ease-in-out infinite 360ms",
            }}
          />

        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes authOverlayIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes authContentIn {
            from {
              opacity: 0;
              transform: translateY(18px) scale(0.94);
              filter: blur(8px);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes authLogo {
            0%, 100% {
              transform: scale(0.96);
              opacity: 0.65;
            }

            50% {
              transform: scale(1.05);
              opacity: 1;
            }
          }

          @keyframes authRing {
            0%, 100% {
              transform: scale(0.94);
              opacity: 0.25;
            }

            50% {
              transform: scale(1.08);
              opacity: 0.8;
            }
          }

          @keyframes authGlow {
            0%, 100% {
              transform: translate(-50%, -50%) scale(0.85);
              opacity: 0.35;
            }

            50% {
              transform: translate(-50%, -50%) scale(1.15);
              opacity: 0.8;
            }
          }

          @keyframes authPulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0;
            }

            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.5;
            }
          }

          @keyframes authDot {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.25;
            }

            30% {
              transform: translateY(-5px);
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* =======================================================
     LOGIN API
  ======================================================== */

  const onSubmit = async (formData) => {
    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      login(response.data);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      let message =
        "Unable to sign in. Please try again later.";

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

      setError("root", {
        message,
      });
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">

      {/* =====================================================
          LOADING OVERLAY

          This is the important part.
          isSubmitting comes directly from react-hook-form.
      ====================================================== */}

      {isSubmitting && (
        <AuthLoadingOverlay type="login" />
      )}

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="border-b border-white/[0.08] bg-black/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <Link
            to="/"
            className="text-2xl font-bold tracking-tight"
          >
            Lead<span className="text-neutral-400">
              MS
            </span>
          </Link>

          {/* Register */}

          <div className="flex items-center gap-2 text-sm text-neutral-500">

            <span className="hidden sm:block">
              Don't have an account?
            </span>

            <Link
              to="/register"
              className="rounded-lg border border-white/[0.12] px-4 py-2 font-medium text-white transition duration-200 hover:border-white/25 hover:bg-white/[0.06]"
            >
              Get started
            </Link>

          </div>

        </div>

      </header>

      {/* =====================================================
          LOGIN AREA
      ====================================================== */}

      <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-y-auto px-5 py-8 sm:px-8">

        {/* Background glow */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[130px]" />

        {/* Login container */}

        <div className="relative w-full max-w-md">

          {/* =================================================
              HEADING
          ================================================== */}

          <div className="mb-5 text-center">

            <p className="text-xs font-medium text-neutral-500">
              Welcome back
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
              Sign in
            </h1>

            <p className="mt-2 text-xs leading-5 text-neutral-500">
              Sign in to continue to your LeadMS workspace.
            </p>

          </div>

          {/* =================================================
              CARD
          ================================================== */}

          <div className="rounded-2xl border border-white/[0.10] bg-[#080808] p-6 shadow-2xl">

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* =================================================
                  REGISTRATION SUCCESS
              ================================================== */}

              {location.state?.message && (
                <div className="rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 text-sm text-neutral-300">
                  {location.state.message}
                </div>
              )}

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-neutral-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full rounded-xl border bg-black px-4 py-3 text-sm text-white outline-none transition duration-200 placeholder:text-neutral-700 ${
                    errors.email
                      ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                      : "border-white/[0.12] focus:border-white/40 focus:ring-2 focus:ring-white/10"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>

                <div className="mb-1.5 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-neutral-300"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-neutral-500 transition hover:text-white"
                  >
                    Forgot password?
                  </Link>

                </div>

                {/* Password wrapper */}

                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full rounded-xl border bg-black px-4 py-3 pr-16 text-sm text-white outline-none transition duration-200 placeholder:text-neutral-700 ${
                      errors.password
                        ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                        : "border-white/[0.12] focus:border-white/40 focus:ring-2 focus:ring-white/10"
                    }`}
                  />

                  {/* Show / Hide */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition duration-200 hover:bg-white/[0.05] hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* =================================================
                  API ERROR
              ================================================== */}

              {errors.root && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">

                  <div className="flex items-start gap-3">

                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-500/40 text-[10px] text-red-400">
                      !
                    </div>

                    <p className="text-xs leading-5 text-red-400">
                      {errors.root.message}
                    </p>

                  </div>

                </div>
              )}

              {/* =================================================
                  SIGN IN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition duration-200 hover:bg-neutral-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isSubmitting ? (
                  <span className="flex items-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />

                    Signing in...

                  </span>
                ) : (
                  <>
                    Sign in

                    <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}

              </button>

            </form>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-5 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/[0.07]" />

              <span className="text-[9px] uppercase tracking-widest text-neutral-700">
                Secure access
              </span>

              <div className="h-px flex-1 bg-white/[0.07]" />

            </div>

            {/* =================================================
                REGISTER
            ================================================== */}

            <div className="text-center">

              <p className="text-xs text-neutral-600">
                Don't have an account?
              </p>

              <Link
                to="/register"
                className="mt-1 inline-block text-sm font-medium text-white transition hover:text-neutral-400"
              >
                Create your LeadMS account →
              </Link>

            </div>

          </div>

          {/* =================================================
              SECURITY
          ================================================== */}

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-700">

            <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />

            Secure authentication

          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;