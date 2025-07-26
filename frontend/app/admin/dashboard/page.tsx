"use client";

import React, { useState } from "react";
import { useFilesQuery } from "@/apis/files/files.query";
import { useUsersQuery } from "@/apis/user/user.query";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, UserX, UserCheck, UserCog, ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/providers/theme-provider";
import FileCard from "@/components/files/FileCard";
import FileViewerModal from "@/components/files/FileViewerModal";
import CreateFolderModal from "@/components/files/CreateFolderModal";
import UploadFileModal from "@/components/files/UploadFileModal";
import ShareFileModal from "@/components/files/ShareFileModal";
import BreadcrumbTrail from "@/components/files/BreadcrumbTrail";
import EditUserModal from "@/components/users/EditUserModal";
import { useDeleteUserMutation } from "@/apis/user/user.mutation";
import { User } from "@/apis/user/user.types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewFileId, setViewFileId] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [activeTab, setActiveTab] = useState<"files" | "users" | "shared">("files");
  
  const { data: filesData, isLoading: filesLoading } = useFilesQuery({ 
    parent: currentFolder,
    search: searchTerm || undefined
  });
  
  const { data: usersData, isLoading: usersLoading } = useUsersQuery({
    page: currentPage,
    limit: usersPerPage
  });
  const deleteUserMutation = useDeleteUserMutation();
  
  const isLoading = filesLoading || usersLoading;
  const files = filesData?.data || [];
  const allUsers = usersData?.data || [];
  const usersPagination = usersData?.pagination;
  
  const filteredUsers = userSearchTerm 
    ? allUsers.filter(user => 
        user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      )
    : allUsers;

  const handleNavigateToFolder = (folderId: string) => {
    console.log("Navigating to folder with ID:", folderId);
    setCurrentFolder(folderId);
  };

  // Function for navigating through the breadcrumb trail
  const handleBreadcrumbNavigation = (folderId: string | null) => {
    setCurrentFolder(folderId);
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        toast.success("User deleted successfully");
        // Reset to page 1 if current page becomes empty after deletion
        if (filteredUsers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  // Reset pagination when searching
  const handleUserSearch = (value: string) => {
    setUserSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4 text-foreground shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">DS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider">
                DESIGN SH<span style={{ color: 'red' }}>A</span>RK
              </h1>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                ADMIN PANEL
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-foreground">Welcome, {user?.name}</span>
            <Button variant="ghost" onClick={logout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="mb-6 flex space-x-4 border-b border-border">
          <button
            className={`py-2 px-4 transition-colors ${
              activeTab === "files"
                ? "border-b-2 border-[var(--primary)] font-medium text-[var(--primary)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setActiveTab("files");
              setCurrentPage(1);
            }}
          >
            Files
          </button>
          <button
            className={`py-2 px-4 transition-colors ${
              activeTab === "users"
                ? "border-b-2 border-[var(--primary)] font-medium text-[var(--primary)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setActiveTab("users");
              setCurrentPage(1);
            }}
          >
            Users
          </button>
          <button
            className={`py-2 px-4 transition-colors ${
              activeTab === "shared"
                ? "border-b-2 border-[var(--primary)] font-medium text-[var(--primary)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              router.push("/admin/dashboard/shared");
            }}
          >
            Shared Files
          </button>
        </div>
        
        {activeTab === "files" && (
          <BreadcrumbTrail 
            currentFolder={currentFolder} 
            onNavigate={handleBreadcrumbNavigation} 
          />
        )}

        {isLoading ? (
          <div className="flex justify-center p-8">Loading...</div>
        ) : activeTab === "files" ? (
          <div>
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                {currentFolder ? 'Folder Contents' : 'All Files'}
              </h2>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div className="flex gap-2">
                  {currentFolder && (
                    <Button variant="outline" onClick={() => handleBreadcrumbNavigation(null)}>
                      Back to Root
                    </Button>
                  )}
                  
                  <Button onClick={() => setShowCreateFolder(true)} style={{backgroundColor: 'var(--primary)'}}>
                    Create Folder
                  </Button>
                  
                  <Button 
                    onClick={() => setShowUploadFile(true)}
                    disabled={!currentFolder}
                    style={{ backgroundColor: 'var(--primary)' }}
                    title={!currentFolder ? "Select a folder first" : "Upload a file"}
                  >
                    Upload File
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  {searchTerm 
                    ? "No files match your search term" 
                    : "No files in this folder"}
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
          </div>
        ) : (
          <div>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                Users Management
              </h2>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <Button onClick={() => window.location.href = "/admin/users/add"} style={{ backgroundColor: 'var(--primary)' }}>
                  <UserPlus size={18} className="mr-1" />
                  Add New User
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-card border border-border shadow-md rounded-lg">
                <thead>
                  <tr className="text-left bg-muted/50">
                    <th className="p-4 font-medium text-foreground">Name</th>
                    <th className="p-4 font-medium text-foreground">Email</th>
                    <th className="p-4 font-medium text-foreground">Role</th>
                    <th className="p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 text-foreground">{user.name}</td>
                        <td className="p-4 text-foreground">{user.email}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' 
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          }`}>
                            {user.role === 'admin' ? (
                              <UserCheck size={12} className="mr-1" />
                            ) : (
                              <UserCheck size={12} className="mr-1" />
                            )}
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              <UserCog size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDeleteUser(user._id)}
                              isLoading={deleteUserMutation.isPending}
                            >
                              <UserX size={14} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {usersPagination && usersPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {((usersPagination.page - 1) * usersPagination.limit) + 1} to{' '}
                  {Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)} of{' '}
                  {usersPagination.total} users
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: usersPagination.totalPages }, (_, i) => i + 1).map((page) => {
                      // Show only a few pages around current page for better UX
                      if (
                        page === 1 || 
                        page === usersPagination.totalPages || 
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "primary" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={page} className="text-muted-foreground px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= usersPagination.totalPages}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
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
      
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
