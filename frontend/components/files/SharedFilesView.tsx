"use client";

import React, { useState } from "react";
import { useFilesQuery } from "@/apis/files/files.query";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import FileCard from "@/components/files/FileCard";
import FileViewerModal from "@/components/files/FileViewerModal";
import ShareFileModal from "@/components/files/ShareFileModal";
import { downloadFile } from "@/apis/files/files.api";
import { toast } from "sonner";

interface SharedFilesViewProps {
  isAdmin?: boolean;
}

export default function SharedFilesView({ isAdmin = false }: SharedFilesViewProps) {
  const [viewFileId, setViewFileId] = useState<string | null>(null);
  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(12);

  const { data: filesData, isLoading, error } = useFilesQuery({
    shared: true,
    search: searchTerm || undefined,
    page: currentPage,
    limit: filesPerPage
  });

  const files = filesData?.data || [];
  const pagination = filesData?.pagination;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleShareFile = (fileId: string) => {
    setShareFileId(fileId);
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      await downloadFile(fileId);
      toast.success("File download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground">Loading shared files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Share2 className="w-6 h-6 text-destructive" />
          </div>
          <p className="text-destructive">Error loading shared files</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin ? "Shared Files Management" : "Files Shared With Me"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "View and manage all shared files in the system" 
              : "Access files that have been shared with you"
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search shared files..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {files.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Share2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">No shared files found</h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "No shared files match your search term" 
                    : isAdmin
                      ? "No files are currently being shared in the system"
                      : "No files have been shared with you yet"
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          files.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onViewFile={(fileId) => setViewFileId(fileId)}
              onShareFile={isAdmin ? handleShareFile : undefined}
              onDownloadFile={handleDownloadFile}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between py-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * filesPerPage) + 1} to {Math.min(currentPage * filesPerPage, pagination.total)} of {pagination.total} files
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                const isActive = pageNumber === currentPage;
                
                return (
                  <Button
                    key={pageNumber}
                    variant={isActive ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              
              {pagination.totalPages > 5 && (
                <>
                  {pagination.totalPages > 6 && <span className="text-muted-foreground">...</span>}
                  <Button
                    variant={currentPage === pagination.totalPages ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pagination.totalPages)}
                    className="w-8 h-8 p-0"
                  >
                    {pagination.totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === pagination.totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      {viewFileId && (
        <FileViewerModal 
          fileId={viewFileId} 
          onClose={() => setViewFileId(null)} 
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
