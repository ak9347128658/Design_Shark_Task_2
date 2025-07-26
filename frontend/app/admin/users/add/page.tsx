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
      await registerMutation.mutateAsync(data);
      toast.success("User created successfully!");
      reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create user");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 p-4 text-gray-900 dark:text-white border-b dark:border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold uppercase tracking-wider">
              DESIGN SH<span color='red'>A</span>RK
            </h1>
            <span className="ml-2 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
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
          >
            <ArrowLeft size={18} className="mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Add New User
          </h2>
        </div>
        
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full rounded border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter user name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter user email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter user password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400"
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
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full rounded border border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              isLoading={registerMutation.isPending}
            >
              Create User
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
