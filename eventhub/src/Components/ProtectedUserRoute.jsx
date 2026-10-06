import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedUserRoute = () => {
  const user = localStorage.getItem("eventHubLoggedIn");

  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedUserRoute;
