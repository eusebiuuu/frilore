import { ReactNode } from "react";
import { useUserContext } from "../context/user";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useUserContext();
  if (!user) {
    toast.error('You have to authenticate to access this route');
    return <Navigate to='/home' replace />
  }
  return children;
}