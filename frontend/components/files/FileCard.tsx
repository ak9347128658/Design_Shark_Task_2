"use client";

import React, { useState } from "react";
import { File as FileIcon, Folder as FolderIcon, MoreVertical, Share2, Download, Edit, Trash2, Eye } from "lucide-react";
import { File } from "@/apis/files/files.types";
// Button import removed as it's not used
import { toast } from "sonner";
import { useDeleteFileMutation, useUpdateFileMutation } from "@/apis/files/files.mutation";

interface FileCardProps {
  file: File;
  onFolderClick?: (folderId: string) => void;
  onViewFile?: (fileId: string) => void;
  onShareFile?: (fileId: string) => void;
  onDownloadFile?: (fileId: string) => void;
}

export default function FileCard({ file, onFolderClick, onViewFile, onShareFile, onDownloadFile }: FileCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
  
  const deleteFileMutation = useDeleteFileMutation();
  const updateFileMutation = useUpdateFileMutation(file._id);
  
  // Each clickable element now has its own handler
  
  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateFileMutation.mutateAsync({ name: newName });
      setIsRenaming(false);
      toast.success(`${file.isFolder ? 'Folder' : 'File'} renamed successfully`);
    } catch {
      toast.error(`Failed to rename ${file.isFolder ? 'folder' : 'file'}`);
    }
  };
  
  const handleDelete = async () => {
    if (!file._id) {
      toast.error(`Cannot delete: Missing file ID`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete this ${file.isFolder ? 'folder' : 'file'}?`)) {
      try {
        // Ensure file._id is valid before proceeding
        console.log(`Deleting file with ID: ${file._id}`);
        await deleteFileMutation.mutateAsync(file._id);
        toast.success(`${file.isFolder ? 'Folder' : 'File'} deleted successfully`);
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(`Failed to delete ${file.isFolder ? 'folder' : 'file'}`);
      }
    }
  };
  
  // Define click handler for the entire card
  const handleCardClick = () => {
    if (file.isFolder && onFolderClick && file._id) {
      console.log("FileCard: Navigating to folder with ID:", file._id);
      onFolderClick(file._id);
    } else if (file.isFolder && (!file._id || file._id === undefined)) {
      console.error("Cannot navigate to folder: Missing folder ID");
      toast.error("Cannot navigate to this folder. Missing folder ID.");
    } else if (!file.isFolder && onViewFile && file._id) {
      console.log("FileCard: Opening file with ID:", file._id);
      onViewFile(file._id);
    }
  };

  return (
    <div 
      className={`bg-card border border-border p-4 rounded-xl shadow-sm relative group transition-all duration-300 hover:shadow-md hover:border-ring/50 ${
        file.isFolder ? 'cursor-pointer hover:bg-accent/50 hover:-translate-y-1' : 'hover:shadow-lg'
      } animate-fade-in`}
      onClick={file.isFolder ? handleCardClick : undefined}
    >
      <div>
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          {file.isFolder ? (
            <div className="p-3 bg-warning/10 rounded-2xl">
              <FolderIcon size={32} className="text-warning" />
            </div>
          ) : (
            <div className="p-3 bg-info/10 rounded-2xl">
              <FileIcon size={32} className="text-info" />
            </div>
          )}
        </div>
        
        {isRenaming ? (
          <form onSubmit={handleRename} className="mt-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 text-sm border border-border rounded-lg bg-input text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              autoFocus
              onBlur={() => setIsRenaming(false)}
            />
          </form>
        ) : (
          <div className="text-center space-y-1">
            <h3 
              className={`font-medium text-foreground truncate transition-all duration-300 text-sm ${
                !file.isFolder ? 'cursor-pointer hover:text-primary' : ''
              }`}
              onClick={(e) => {
                if (!file.isFolder) {
                  e.stopPropagation();
                  if (file._id && onViewFile) {
                    onViewFile(file._id);
                  }
                }
              }}
              title={file.name}
            >
              {file.name}
            </h3>
            {!file.isFolder && file.size && (
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
        )}
      </div>
      
      <button 
        className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-accent rounded-lg cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setShowActions(!showActions);
        }}
      >
        <MoreVertical size={16} className="text-muted-foreground hover:text-foreground transition-colors duration-200" />
      </button>
      
      {showActions && (
        <div 
          className="absolute top-12 right-3 z-10 bg-card border border-border shadow-lg rounded-lg py-2 min-w-[150px] animate-slide-in"
          onClick={(e) => e.stopPropagation()}
        >
          {!file.isFolder && (
            <>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center gap-2 transition-colors duration-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(false);
                  if (onViewFile) onViewFile(file._id);
                }}
              >
                <Eye size={14} />
                View
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center gap-2 transition-colors duration-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(false);
                  if (onDownloadFile) onDownloadFile(file._id);
                }}
              >
                <Download size={14} />
                Download
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center gap-2 transition-colors duration-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(false);
                  if (onShareFile) onShareFile(file._id);
                }}
              >
                <Share2 size={14} />
                Share
              </button>
              <div className="border-t border-border my-1"></div>
            </>
          )}
          <button 
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center gap-2 transition-colors duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsRenaming(true);
              setShowActions(false);
            }}
          >
            <Edit size={14} />
            Rename
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
              setShowActions(false);
            }}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
