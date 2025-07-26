"use client";

import React, { useState, useEffect } from "react";
import { useFilesQuery } from "@/apis/files/files.query";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import FileCard from "@/components/files/FileCard";
import FileViewerModal from "@/components/files/FileViewerModal";
import CreateFolderModal from "@/components/files/CreateFolderModal";
import UploadFileModal from "@/components/files/UploadFileModal";
import ShareFileModal from "@/components/files/ShareFileModal";
import BreadcrumbTrail from "@/components/files/BreadcrumbTrail";
import { ThemeToggle } from "@/providers/theme-provider";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("Current folder state changed to:", currentFolder);
  }, [currentFolder]);
  const [viewFileId, setViewFileId] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showShared] = useState(false);
  
  // Use explicit query options to ensure parent parameter is correctly sent
  const { data: filesData, isLoading, error } = useFilesQuery({ 
    parent: currentFolder ? String(currentFolder) : null,
    search: searchTerm || undefined,
    shared: showShared || undefined
  });
  
  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="flex justify-center p-8">Error loading files</div>;
  
  const files = filesData?.data || [];

  const handleNavigateToFolder = (folderId: string | null) => {
    console.log("Navigating to folder with ID:", folderId);
    setCurrentFolder(folderId);
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">DS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider text-foreground">
                DESIGN SH<span color='red'>A</span>RK
              </h1>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                FILE COLLECTION
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <span className="text-foreground hidden sm:block">Welcome, {user?.name}</span>
            </div>
            <Button variant="ghost" onClick={logout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <BreadcrumbTrail 
            currentFolder={currentFolder} 
            onNavigate={handleNavigateToFolder} 
          />
        </div>
        
        {/* Main header and controls */}
        <div className="mb-8 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {currentFolder ? 'Folder Contents' : 'All Files'}
            </h2>
            <p className="text-muted-foreground">
              {currentFolder ? 'Browse files in this folder' : 'Manage your files and folders'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Folder
              </Button>
              
              <Button 
                onClick={() => setShowUploadFile(true)} 
                disabled={!currentFolder}
                title={!currentFolder ? "Select a folder first" : "Upload a file"}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {files.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">No files found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? "No files match your search term" 
                      : showShared 
                        ? "No files have been shared with you" 
                        : "This folder is empty. Upload some files to get started."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            files.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                onFolderClick={handleNavigateToFolder}
                onViewFile={(fileId) => setViewFileId(fileId)}
              />
            ))
          )}
        </div>
      </main>
      
      {viewFileId && (
        <FileViewerModal 
          fileId={viewFileId} 
          onClose={() => setViewFileId(null)} 
        />
      )}
      
      {showCreateFolder && (
        <CreateFolderModal
          parentId={currentFolder}
          onClose={() => setShowCreateFolder(false)}
        />
      )}
      
      {showUploadFile && (
        <UploadFileModal
          parentId={currentFolder}
          onClose={() => setShowUploadFile(false)}
        />
      )}
      
      {shareFileId && (
        <ShareFileModal
          fileId={shareFileId}
          onClose={() => setShareFileId(null)}
        />
      )}
    </div>
  );
}
