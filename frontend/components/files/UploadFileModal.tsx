"use client";

import React, { useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { useUploadFileMutation } from "@/apis/files/files.mutation";
import { toast } from "sonner";

interface UploadFileModalProps {
  parentId: string | null;
  onClose: () => void;
}

export default function UploadFileModal({ parentId, onClose }: UploadFileModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileMutation = useUploadFileMutation();
  
  // Redirect to parent folder selection if no parent folder is selected
  React.useEffect(() => {
    if (!parentId) {
      toast.error("Please select a folder first before uploading files");
      onClose();
    }
  }, [parentId, onClose]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      await uploadFileMutation.mutateAsync({
        file: selectedFile,
        parent: parentId
      });
      
      toast.success("File uploaded successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border p-6 rounded-xl shadow-xl w-full max-w-md animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Upload File
          </h2>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-lg hover:bg-accent"
          >
            <X size={20} />
          </button>
        </div>
        
        <div
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-ring hover:bg-accent/50 transition-all duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="space-y-3">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Selected file:
                </p>
                <p className="text-foreground font-medium break-all">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Upload className="text-primary" size={28} />
              </div>
              <div className="space-y-2">
                <p className="text-foreground font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  Max file size: 10MB
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            size="md"
          >
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={isUploading}
            disabled={!selectedFile}
            onClick={handleUpload}
            size="md"
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </div>
    </div>
  );
}
