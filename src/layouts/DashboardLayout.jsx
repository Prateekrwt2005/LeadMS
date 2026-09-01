import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const icons = {
  Dashboard: "⌂",
  "My Products": "▦",
  "Available Products": "◈",
  "Locked Products": "◆",
  Leads: "◎",
  Quotes: "◇",
  Profile: "◯",
  Analytics: "▥",
  Users: "♙",
  "All Leads": "◉",
};

function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role?.toLowerCase();

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      roles: ["trader", "vendor", "team-member", "admin"],
    },
    {
      label: "My Products",
      path: "/dashboard/trader-products",
      roles: ["trader"],
    },
    {
      label: "Available Products",
      path: "/dashboard/available-products",
      roles: ["vendor"],
    },
    {
      label: "Locked Products",
      path: "/dashboard/locked-products",
      roles: ["vendor", "team-member"],
    },
    {
      label: "Leads",
      path: "/dashboard/leads",
      roles: ["vendor", "team-member"],
    },
    {
      label: "Quotes",
      path: "/dashboard/quotes",
      roles: ["vendor", "team-member"],
    },
    {
      label: "Profile",
      path: "/dashboard/profile",
      roles: ["vendor"],
    },
    {
      label: "Analytics",
      path: "/dashboard/admin",
      roles: ["admin"],
    },
    {
      label: "Users",
      path: "/dashboard/admin/users",
      roles: ["admin"],
    },
    {
      label: "All Leads",
      path: "/dashboard/admin/leads",
      roles: ["admin"],
    },
  ];

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  );

  const workspaceName =
    role === "trader"
      ? "Trader workspace"
      : role === "vendor"
        ? "Vendor workspace"
        : role === "team-member"
          ? "Sales workspace"
          : role === "admin"
            ? "Admin workspace"
            : "Workspace";

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
  };

  /* ============================================================
     NAVIGATION
  ============================================================ */

  const navigation = (
    <nav className="flex-1 px-3 py-5">
      <div className="space-y-1">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-white" />
                )}

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm transition-all duration-200 ${
                    isActive
                      ? "border-white/15 bg-white/[0.08] text-white"
                      : "border-white/[0.06] bg-white/[0.02] text-slate-600 group-hover:border-white/10 group-hover:bg-white/[0.05] group-hover:text-slate-300"
                  }`}
                >
                  {icons[item.label]}
                </span>

                <span>{item.label}</span>

                {isActive && (
                  <span className="ml-auto text-xs text-slate-600">
                    →
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );

  /* ============================================================
     USER SECTION
  ============================================================ */

  const userSection = (
    <div className="border-t border-white/[0.07] p-4">

      <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-sm font-semibold text-white">
          {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {user?.firstName || "User"}
          </p>

          <p className="truncate text-xs capitalize text-slate-600">
            {role || "Member"}
          </p>
        </div>

      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-3 w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-white/[0.04] hover:text-white"
      >
        Sign out
      </button>

    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ========================================================
          MOBILE OVERLAY
      ======================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ========================================================
          MOBILE SIDEBAR
      ======================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/[0.08] bg-[#050505] transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/[0.07] px-6">

          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-semibold tracking-tight text-white"
          >
            Lead<span className="text-slate-500">MS</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
          >
            ×
          </button>

        </div>

        <div className="border-b border-white/[0.07] px-6 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-700">
            Workspace
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {workspaceName}
          </p>
        </div>

        {navigation}

        {userSection}
      </aside>

      {/* ========================================================
          DESKTOP
      ======================================================== */}

      <div className="flex min-h-screen">

        {/* ======================================================
            SIDEBAR
        ======================================================= */}

        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-white/[0.07] bg-[#050505] lg:flex">

          {/* Logo */}
          <div className="border-b border-white/[0.07] px-6 py-6">

            <Link
              to="/dashboard"
              className="text-2xl font-semibold tracking-tight text-white transition hover:text-slate-300"
            >
              Lead<span className="text-slate-500">MS</span>
            </Link>

            <p className="mt-2 text-xs text-slate-600">
              Sales management platform
            </p>

          </div>

          {/* Workspace */}
          <div className="px-6 pt-5">

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-700">
              Workspace
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {workspaceName}
            </p>

          </div>

          {navigation}

          {userSection}

        </aside>

        {/* ======================================================
            MAIN
        ======================================================= */}

        <div className="flex min-w-0 flex-1 flex-col bg-black">

          {/* ====================================================
              TOP BAR
          ===================================================== */}

          <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-black/90 px-5 backdrop-blur-xl sm:px-7 lg:px-9">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-slate-500 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
                aria-label="Open navigation"
              >
                ☰
              </button>

              <div>

                <p className="hidden text-[10px] uppercase tracking-[0.2em] text-slate-700 sm:block">
                  Workspace
                </p>

                <p className="text-sm text-slate-400">
                  {workspaceName}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-medium text-white">
                  {user?.firstName || "User"}
                </p>

                <p className="text-xs capitalize text-slate-600">
                  {role || "Member"}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-sm font-semibold text-white">
                {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>

            </div>

          </header>

          {/* ====================================================
              PAGE CONTENT
          ===================================================== */}

          <main className="flex-1">

            <div className="w-full px-5 pb-10 pt-4 sm:px-7 sm:pb-12 sm:pt-5 lg:px-9 lg:pb-14 lg:pt-5 xl:px-10">

              <div className="w-full max-w-[1600px]">

                <Outlet />

              </div>

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;