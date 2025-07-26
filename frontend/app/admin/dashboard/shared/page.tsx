"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/providers/theme-provider";
import SharedFilesView from "@/components/files/SharedFilesView";

export default function AdminSharedFilesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Navigation Header */}
      <nav className="bg-card border-b border-border p-4 sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Admin Dashboard
            </Button>
            <div className="h-6 w-px bg-border"></div>
            <div>
              <h1 className="font-semibold text-foreground">Shared Files Management</h1>
              <p className="text-sm text-muted-foreground">Admin view of all shared files</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email} (Admin)</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="h-6 w-px bg-border"></div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <SharedFilesView isAdmin={true} />
      </main>
    </div>
  );
}
