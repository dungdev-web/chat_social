import { Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // ✅ Đã login → không cho vào /login
  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
}
