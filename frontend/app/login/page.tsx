"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { LoginSchema, LoginInputs } from "@/apis/auth/auth.types";
import { useLoginMutation } from "@/apis/auth/auth.mutation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const loginMutation = useLoginMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const onSubmit = async (data: LoginInputs) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      login(response.data);
      toast.success("Login successful!");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response!.data!.message
          : "Failed to login";
      toast.error(errorMessage);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-xl bg-card border border-border p-8 shadow-lg animate-slide-in">
        <div className="mb-8 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-2xl">DS</span>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">
              DESIGN SH<span color="red">A</span>RK
            </h1>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              FILE COLLECTION
            </p>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome Back
          </h2>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 pr-12 text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password.message}
              </p>
            )}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <a href="#" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                Contact administrator
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
