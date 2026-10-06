import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const admin = localStorage.getItem("eventHubAdmin");

  // Admin login નથી કર્યો
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Admin login છે
  return <Outlet />;
};

export default ProtectedAdminRoute;
