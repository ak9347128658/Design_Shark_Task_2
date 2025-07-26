"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useFileQuery } from "@/apis/files/files.query";
import { getFileById } from "@/apis/files/files.api";
import { File } from "@/apis/files/files.types";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface BreadcrumbTrailProps {
  currentFolder: string | null;
  onNavigate: (folderId: string | null) => void;
}

export default function BreadcrumbTrail({ currentFolder, onNavigate }: BreadcrumbTrailProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Query for the current folder details
  const { data: folderData } = useFileQuery(currentFolder || "");

  // Function to build breadcrumb path
  const buildBreadcrumbPath = async (folder: File | undefined) => {
    // First, clear existing breadcrumbs to prevent duplication
    setBreadcrumbs([]);
    
    if (!folder) {
      console.log("No folder provided, breadcrumbs cleared");
      return;
    }

    console.log("Building breadcrumb path for folder:", folder.name, folder._id);
    setIsLoading(true);
    try {
      // Start with the current folder
      const path: BreadcrumbItem[] = [{ id: folder._id, name: folder.name }];
      
      // Recursively fetch parent folders
      let currentParent = folder.parent;
      while (currentParent) {
        try {
          console.log("Fetching parent folder:", currentParent);
          // Use the getFileById function from files.api.ts
          const parentData = await getFileById(currentParent);
          if (!parentData?.data?.file) break;
          
          const parentFolder = parentData.data.file;
          console.log("Found parent:", parentFolder.name, parentFolder._id);
          
          // Add to the beginning of the path
          path.unshift({ id: parentFolder._id, name: parentFolder.name });
          currentParent = parentFolder.parent;
        } catch (error) {
          console.error("Error fetching parent folder:", error);
          break;
        }
      }
      
      console.log("Final breadcrumb path:", path);
      // Set the path as the new breadcrumbs (don't add to existing breadcrumbs)
      setBreadcrumbs(path);
     
    } catch (error) {
      console.error("Error building breadcrumb path:", error);
      setBreadcrumbs([{ id: folder._id, name: folder.name }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the breadcrumbs entirely when the folder ID changes
  useEffect(() => {
    // Reset the breadcrumbs first
    setBreadcrumbs([]);
    
    if (currentFolder) {
      if (folderData?.data?.file) {
        // Rebuild from scratch
        buildBreadcrumbPath(folderData.data.file);
      }
    }
    // No need to setBreadcrumbs([]) here as we're already doing it at the start
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolder, folderData?.data?.file?._id]);

  if (!currentFolder) {
    return (
      <div className="flex items-center text-sm py-3 bg-card rounded-lg px-4 border border-border">
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
          <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <span className="text-foreground font-medium">Root Directory</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center text-sm py-3 bg-card rounded-lg px-4 border border-border">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-4 h-4 bg-muted rounded"></div>
          <div className="w-20 h-4 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-3 shadow-sm">
      <div className="flex items-center flex-wrap text-sm overflow-x-auto">
        <button 
          onClick={() => onNavigate(null)}
          className="flex items-center space-x-1 text-muted-foreground hover:text-primary font-medium transition-colors duration-200 px-2 py-1 rounded-md hover:bg-accent"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Root</span>
        </button>
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={`${crumb.id}-${index}`}>
            <ChevronRight size={16} className="mx-1 text-muted-foreground/60" />
            <button
              onClick={() => index < breadcrumbs.length - 1 ? onNavigate(crumb.id) : null}
              className={`px-2 py-1 rounded-md transition-all duration-200 ${
                index === breadcrumbs.length - 1
                  ? "text-primary font-medium bg-primary/10" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              }`}
              disabled={index === breadcrumbs.length - 1}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
