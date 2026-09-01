import { useEffect, useState } from "react";
import api from "../services/api";

const roleStyles = {
  admin:
    "border-white/[0.14] bg-white/[0.08] text-white",

  vendor:
    "border-white/[0.10] bg-white/[0.04] text-neutral-300",

  trader:
    "border-white/[0.10] bg-white/[0.04] text-neutral-300",

  team:
    "border-white/[0.10] bg-white/[0.04] text-neutral-400",

  "team-member":
    "border-white/[0.10] bg-white/[0.04] text-neutral-400",
};

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/users");

        setUsers(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-500">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
            Users
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            View all registered users across the LeadMS platform.
          </p>

        </div>


        {/* Total users */}
        {!loading && !error && (
          <div className="w-fit rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5">

            <p className="text-[10px] uppercase tracking-wider text-neutral-600">
              Total users
            </p>

            <p className="mt-0.5 text-lg font-semibold text-white">
              {users.length}
            </p>

          </div>
        )}

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-sm text-red-400">
              !
            </div>

            <div>

              <p className="text-sm font-medium text-red-400">
                Unable to load users
              </p>

              <p className="mt-1 text-xs leading-5 text-red-400/70">
                {error}
              </p>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          USERS TABLE
      ===================================================== */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808]">

        {/* Table header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">

          <div>

            <h2 className="text-sm font-semibold text-white">
              Platform users
            </h2>

            <p className="mt-1 text-xs text-neutral-600">
              Registered accounts and their assigned roles.
            </p>

          </div>

          {!loading && !error && (
            <span className="hidden text-xs text-neutral-600 sm:block">
              {users.length}{" "}
              {users.length === 1 ? "account" : "accounts"}
            </span>
          )}

        </div>


        {/* =================================================
            LOADING
        ================================================= */}
        {loading ? (

          <div className="p-6">

            <div className="space-y-4">

              {[1, 2, 3, 4, 5].map((item) => (

                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4"
                >

                  <div className="h-10 w-10 rounded-xl bg-white/[0.05]" />

                  <div className="flex-1 space-y-2">

                    <div className="h-3 w-36 rounded bg-white/[0.06]" />

                    <div className="h-2.5 w-48 rounded bg-white/[0.04]" />

                  </div>

                  <div className="hidden h-6 w-16 rounded-full bg-white/[0.05] sm:block" />

                </div>

              ))}

            </div>

          </div>


        ) : users.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */
          <div className="p-14 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-neutral-600">
              U
            </div>

            <h3 className="mt-5 text-sm font-semibold text-white">
              No users found
            </h3>

            <p className="mt-2 text-xs text-neutral-600">
              There are currently no registered users.
            </p>

          </div>


        ) : (

          /* =================================================
             TABLE
          ================================================= */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead className="border-b border-white/[0.07]">

                <tr className="text-[10px] uppercase tracking-wider text-neutral-600">

                  <th className="px-6 py-4 font-medium">
                    Name
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Email
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Role
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-white/[0.06]">

                {users.map((user) => {

                  const role =
                    user.role?.toLowerCase() || "unknown";

                  return (

                    <tr
                      key={user._id}
                      className="group transition-colors hover:bg-white/[0.025]"
                    >

                      {/* =========================
                          NAME
                      ========================= */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-neutral-400 transition group-hover:border-white/[0.15] group-hover:text-white">
                            {user.firstName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <div>

                            <p className="text-sm font-medium text-white">
                              {user.firstName}{" "}
                              {user.lastName}
                            </p>

                            <p className="mt-0.5 text-[10px] text-neutral-700">
                              Registered user
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* =========================
                          EMAIL
                      ========================= */}
                      <td className="px-6 py-5">

                        <p className="text-sm text-neutral-400">
                          {user.email}
                        </p>

                      </td>


                      {/* =========================
                          ROLE
                      ========================= */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium capitalize ${
                            roleStyles[role] ||
                            "border-white/[0.08] bg-white/[0.03] text-neutral-500"
                          }`}
                        >
                          {role.replace("-", " ")}
                        </span>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminUsers;