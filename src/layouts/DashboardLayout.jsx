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

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
  };

  const navigation = (
    <nav className="flex-1 space-y-1 p-4">
      {visibleNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/dashboard"}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-500/10 text-indigo-400"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-sm">
            {icons[item.label]}
          </span>

          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  const userSection = (
    <div className="border-t border-slate-800 p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-400">
          {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {user?.firstName || "User"}
          </p>

          <p className="truncate text-xs capitalize text-slate-500">
            {role || "Member"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
      >
        Sign out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-6">
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="text-2xl font-bold tracking-tight"
          >
            Lead<span className="text-indigo-400">MS</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {navigation}

        {userSection}
      </aside>

      <div className="flex min-h-screen">

        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-slate-900/70 lg:flex">

          {/* Logo */}
          <div className="border-b border-slate-800 px-6 py-6">
            <Link
              to="/dashboard"
              className="text-2xl font-bold tracking-tight"
            >
              Lead<span className="text-indigo-400">MS</span>
            </Link>

            <p className="mt-1 text-xs text-slate-500">
              Sales management platform
            </p>
          </div>

          {navigation}

          {userSection}
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur sm:px-6">

            <div className="flex items-center gap-3">

              {/* Mobile menu */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
                aria-label="Open navigation"
              >
                <span className="text-xl">☰</span>
              </button>

              <div>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {role === "trader"
                    ? "Trader workspace"
                    : role === "vendor"
                      ? "Vendor workspace"
                      : role === "team-member"
                        ? "Sales workspace"
                        : "Admin workspace"}
                </p>
              </div>
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">
                  {user?.firstName || "User"}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {role || "Member"}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-400">
                {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </header>

          {/* Page */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;