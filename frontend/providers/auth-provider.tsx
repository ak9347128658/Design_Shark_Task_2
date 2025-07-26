"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { queryClient } from "./query-provider";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: { user: User; token: string }) => {
    setUser(userData.user);
    setToken(userData.token);
    
    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.token);
    
    // Redirect based on role
    if (userData.user.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear query cache
    queryClient.clear();
    
    // Redirect to login
    router.push("/login");
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
