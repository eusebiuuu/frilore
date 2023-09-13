import { ReactNode } from "react";
import { useUserContext } from "../context/user";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useUserContext();
  
  if (!user) {
    toast.error('Forbidden route. Redirecting to home page...');
    return <Navigate to='/' replace />
  }
  return children;
}