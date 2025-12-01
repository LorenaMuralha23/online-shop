import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const logged = localStorage.getItem("loggedUser");

  if (!logged) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
