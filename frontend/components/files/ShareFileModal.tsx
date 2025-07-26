"use client";

import React, { useState, useEffect } from "react";
import { X, Search, UserPlus, UserMinus } from "lucide-react";
import { Button } from "../ui/button";
import { useShareFileMutation, useUnshareFileMutation } from "@/apis/files/files.mutation";
import { useUsersQuery } from "@/apis/user/user.query";
import { useFileQuery } from "@/apis/files/files.query";
import { toast } from "sonner";

interface ShareFileModalProps {
  fileId: string;
  onClose: () => void;
}

export default function ShareFileModal({ fileId, onClose }: ShareFileModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const { data: fileData } = useFileQuery(fileId);
  const { data: usersData, isLoading } = useUsersQuery();
  
  const shareFileMutation = useShareFileMutation(fileId);
  const unshareFileMutation = useUnshareFileMutation(fileId);
  
  const file = fileData?.data?.file;
  const users = usersData?.data || [];
  
  // Initialize selected users from file's shared users
  useEffect(() => {
    if (file?.sharedWith) {
      setSelectedUsers(file.sharedWith);
    }
  }, [file?.sharedWith]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };
  
  const handleShare = async () => {
    if (!file) return;
    
    // Find users that need to be added (weren't previously shared)
    const usersToAdd = selectedUsers.filter(userId => 
      !file.sharedWith?.includes(userId)
    );
    
    // Find users that need to be removed (were previously shared but not selected anymore)
    const usersToRemove = (file.sharedWith || []).filter(userId => 
      !selectedUsers.includes(userId)
    );
    
    try {
      // Share with new users if any
      if (usersToAdd.length > 0) {
        await shareFileMutation.mutateAsync({ userIds: usersToAdd });
      }
      
      // Unshare with removed users if any
      for (const userId of usersToRemove) {
        await unshareFileMutation.mutateAsync(userId);
      }
      
      toast.success("Sharing settings updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update sharing settings");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border p-6 rounded-xl shadow-xl w-full max-w-md animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Share {file?.name}
          </h2>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-lg hover:bg-accent cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
          />
        </div>
        
        <div className="max-h-60 overflow-y-auto mb-6 border border-border rounded-lg">
          {isLoading ? (
            <div className="text-center p-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center p-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filteredUsers.map(user => (
                <li key={user._id} className="p-4 hover:bg-accent/50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant={selectedUsers.includes(user._id) ? "primary" : "outline"}
                      size="sm"
                      onClick={() => handleToggleUser(user._id)}
                      className="min-w-[80px]"
                    >
                      {selectedUsers.includes(user._id) ? (
                        <>
                          <UserMinus size={14} className="mr-1" />
                          Remove
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} className="mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
            onClick={handleShare}
            isLoading={shareFileMutation.isPending || unshareFileMutation.isPending}
            size="md"
          >
            {shareFileMutation.isPending || unshareFileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
