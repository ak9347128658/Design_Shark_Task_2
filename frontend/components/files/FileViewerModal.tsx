"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useFileQuery } from "@/apis/files/files.query";
import { X } from "lucide-react";
import { Button } from "../ui/button";

// Dynamically import the FileViewer to avoid SSR issues
const FileViewer = dynamic(() => import("react-file-viewer"), { ssr: false });

interface FileViewerModalProps {
  fileId: string;
  onClose: () => void;
}

export default function FileViewerModal({ fileId, onClose }: FileViewerModalProps) {
  const { data, isLoading, error } = useFileQuery(fileId);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card border border-border p-8 rounded-xl shadow-xl w-full max-w-4xl animate-slide-in">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-foreground">Loading file...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !data?.data?.file || !data?.data?.downloadUrl) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card border border-border p-8 rounded-xl shadow-xl w-full max-w-4xl animate-slide-in">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">Error loading file</h3>
              <p className="text-muted-foreground">The file could not be loaded or accessed.</p>
            </div>
            <div className="flex justify-center">
              <Button onClick={onClose} variant="outline">Close</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const file = data.data.file;
  const downloadUrl = data.data.downloadUrl.url;
  
  // Get the file extension
  const fileExtension = file.name.split(".").pop() || "";
  
  // Handle file type for the viewer
  const getFileType = (extension: string): string => {
    const fileTypes: Record<string, string> = {
      docx: "docx",
      xlsx: "xlsx",
      csv: "csv",
      png: "png",
      jpg: "jpg",
      jpeg: "jpg",
      gif: "gif",
      txt: "txt",
      // pdf is handled separately now
    };
    
    return fileTypes[extension.toLowerCase()] || "";
  };
  
  const fileType = getFileType(fileExtension);
  const isPdf = fileExtension.toLowerCase() === "pdf";
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border p-6 rounded-xl shadow-xl w-full max-w-6xl h-[85vh] animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-info" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {file.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {file.size && `File size: ${(file.size / 1024).toFixed(2)} KB`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-accent cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="h-[calc(85vh-120px)] overflow-auto bg-muted/30 rounded-lg border border-border">
          {isPdf ? (
            <iframe 
              src={`${downloadUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full rounded-lg"
              title={file.name}
            />
          ) : fileType ? (
            <div className="w-full h-full">
              <FileViewer
                fileType={fileType}
                filePath={downloadUrl}
                errorComponent={
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-warning" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Preview Not Available</h3>
                    <p className="text-muted-foreground">This file format is not supported for preview</p>
                  </div>
                }
                onError={(e: Error) => console.error(e)}
              />
            </div>
          ) : (
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Preview Not Available</h3>
                <p className="text-muted-foreground mb-4">This file type cannot be previewed in the browser.</p>
                <Button 
                  variant="primary"
                  onClick={() => window.open(downloadUrl, '_blank')}
                  className="inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download File
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
