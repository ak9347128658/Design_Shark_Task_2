"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/apis/user/user.mutation";
import { UpdateUserSchema, UpdateUserInputs, User as UserType } from "@/apis/user/user.types";
import { toast } from "sonner";

interface EditUserModalProps {
  user: UserType;
  onClose: () => void;
}

export default function EditUserModal({ user, onClose }: EditUserModalProps) {
  const updateUserMutation = useUpdateUserMutation(user._id);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateUserInputs>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });

  // Reset form when user changes
  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      role: user.role
    });
  }, [user, reset]);
  
  const onSubmit = async (data: UpdateUserInputs) => {
    try {
      await updateUserMutation.mutateAsync(data);
      toast.success("User updated successfully!");
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response!.data!.message
          : "Failed to update user";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-lg animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Edit User</h2>
              <p className="text-sm text-muted-foreground">Update user information</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full w-8 h-8 p-0"
          >
            <X size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              {...register("role")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
