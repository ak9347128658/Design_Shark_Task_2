"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/apis/auth/auth.mutation";
import { RegisterSchema, RegisterInputs } from "@/apis/auth/auth.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { queryClient } from "@/providers/query-provider";

export default function AddUserPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterInputs>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user" // Default role
    }
  });
  
  const onSubmit = async (data: RegisterInputs) => {
    try {
      const registerUser = await registerMutation.mutateAsync(data);
      if(registerUser) {
        queryClient.invalidateQueries({queryKey: ['users']});
        toast.success("User created successfully!");
        reset();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create user");
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 text-foreground shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold uppercase tracking-wider">
              DESIGN SH<span color='red'>A</span>RK
            </h1>
            <span className="ml-2 text-xs uppercase tracking-widest text-muted-foreground">
              ADMIN PANEL
            </span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <ArrowLeft size={18} className="mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-foreground">
            Add New User
          </h2>
        </div>
        
        <div className="max-w-md mx-auto bg-card border border-border p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground p-2.5 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Enter user name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground p-2.5 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Enter user email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground p-2.5 pr-12 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Enter user password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground hover:text-foreground transition-colors"
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
                <p className="mt-1 text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full rounded-md border border-input bg-background text-foreground p-2.5 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              isLoading={registerMutation.isPending}
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Create User
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
