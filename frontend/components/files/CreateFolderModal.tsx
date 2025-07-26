"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { CreateFolderSchema, CreateFolderInputs } from "@/apis/files/files.types";
import { useCreateFolderMutation } from "@/apis/files/files.mutation";
import { toast } from "sonner";

interface CreateFolderModalProps {
  parentId: string | null;
  onClose: () => void;
}

export default function CreateFolderModal({ parentId, onClose }: CreateFolderModalProps) {
  const createFolderMutation = useCreateFolderMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateFolderInputs>({
    resolver: zodResolver(CreateFolderSchema),
    defaultValues: {
      name: "",
      parent: parentId
    }
  });
  
  const onSubmit = async (data: CreateFolderInputs) => {
    try {
      await createFolderMutation.mutateAsync(data);
      toast.success("Folder created successfully");
      onClose();
    } catch {
      toast.error("Failed to create folder");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border p-6 rounded-xl shadow-xl w-full max-w-md animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Create New Folder
          </h2>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-lg hover:bg-accent cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Folder Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              placeholder="Enter folder name"
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createFolderMutation.isPending}
              size="md"
            >
              {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
