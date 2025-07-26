"use client";

import { usePathname, redirect } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

const publicPaths = ["/login", "/register"];
const adminPaths = ["/admin", "/admin/dashboard", "/admin/users"];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // Wait for authentication check to complete
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return <>{children}</>;
  }

  // If no user is logged in and not on a public path, redirect to login
  if (!user && !publicPaths.some(path => pathname.startsWith(path))) {
    redirect("/login");
  }

  // If user is not admin but trying to access admin paths
  if (user && user.role !== "admin" && adminPaths.some(path => pathname.startsWith(path))) {
    redirect("/dashboard");
  }

  // If user is admin but trying to access user-only paths
  if (user && user.role === "admin" && pathname.startsWith("/dashboard") && !pathname.startsWith("/admin")) {
    redirect("/admin/dashboard");
  }

  return <>{children}</>;
}
