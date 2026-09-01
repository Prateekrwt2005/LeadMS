import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import TraderProducts from "../pages/TraderProducts";
import AvailableProducts from "../pages/AvailableProducts";
import LockedProducts from "../pages/LockedProducts";

import Leads from "../pages/Leads";
import Quotes from "../pages/Quotes";
import VendorProfile from "../pages/VendorProfile";

import AdminAnalytics from "../pages/AdminAnalytics";
import AdminUsers from "../pages/AdminUsers";
import AdminLeads from "../pages/AdminLeads";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/dashboard/trader-products"
              element={<TraderProducts />}
            />

            <Route
              path="/dashboard/available-products"
              element={<AvailableProducts />}
            />

            <Route
              path="/dashboard/locked-products"
              element={<LockedProducts />}
            />

            <Route
              path="/dashboard/leads"
              element={<Leads />}
            />

            <Route
              path="/dashboard/quotes"
              element={<Quotes />}
            />

            <Route
              path="/dashboard/profile"
              element={<VendorProfile />}
            />

            {/* Admin */}
            <Route element={<AdminRoute />}>
  <Route
    path="/dashboard/admin"
    element={<AdminAnalytics />}
  />

  <Route
    path="/dashboard/admin/users"
    element={<AdminUsers />}
  />

  <Route
    path="/dashboard/admin/leads"
    element={<AdminLeads />}
  />
</Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;