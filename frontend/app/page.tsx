"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/providers/theme-provider";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background animate-fade-in">
      <div className="text-center space-y-6 animate-slide-in">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto shadow-lg">
          <span className="text-primary-foreground font-bold text-3xl">DS</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground">
            Design Shark
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional File Management System
          </p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6 mt-12">
        <Button 
          size="lg" 
          className="w-full bg-[var(--primary)]  text-primary-foreground" 
          onClick={() => router.push("/login")}
        >
          Get Started
        </Button>
        
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
