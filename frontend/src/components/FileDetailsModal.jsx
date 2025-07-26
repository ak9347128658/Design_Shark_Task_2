import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText,
  Archive,
  Calendar,
  User,
  HardDrive,
  Eye,
  X
} from 'lucide-react';

const FileDetailsModal = ({ isOpen, onClose, file, onDelete }) => {
  const [loading, setLoading] = useState(false);

  if (!file) return null;

  const getFileIcon = (fileName, mimeType) => {
    if (mimeType?.startsWith('image/')) return Image;
    if (mimeType?.startsWith('video/')) return Video;
    if (mimeType?.startsWith('audio/')) return Music;
    if (mimeType?.includes('pdf') || mimeType?.includes('document')) return FileText;
    if (mimeType?.includes('zip') || mimeType?.includes('rar')) return Archive;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Check if downloadUrl is available directly in the file object
      if (file.downloadUrl && file.downloadUrl.url) {
        // Open the SAS URL in a new tab
        window.open(file.downloadUrl.url, '_blank');
      } else {
        console.log('No direct download URL available, fetching from API...');
        // If downloadUrl is not available, implement alternative download method
        // This could be a call to your fileService.downloadFile method
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      setLoading(true);
      try {
        await onDelete(file._id);
        onClose();
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const FileIcon = getFileIcon(file.name, file.mimeType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <FileIcon size={24} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <DialogTitle className="text-left">{file.name}</DialogTitle>
                <DialogDescription className="text-left">
                  File Details
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* File Preview */}
          {file.mimeType?.startsWith('image/') && (
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={file.url || '/placeholder-image.jpg'} 
                alt={file.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                <FileIcon size={48} className="text-gray-400" />
              </div>
            </div>
          )}

          {/* File Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">File Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <HardDrive size={16} className="text-gray-500" />
                    <span className="text-muted-foreground">Size:</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <File size={16} className="text-gray-500" />
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">{file.mimeType || 'Unknown'}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-muted-foreground">Modified:</span>
                    <span>{formatDate(file.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Access & Sharing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-muted-foreground">Owner:</span>
                    <span>{file.owner?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye size={16} className="text-gray-500" />
                    <span className="text-muted-foreground">Visibility:</span>
                    <Badge variant={file.isPublic ? 'default' : 'secondary'}>
                      {file.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  {file.sharedWith && file.sharedWith.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Share2 size={16} className="text-gray-500" />
                      <span className="text-muted-foreground">Shared with:</span>
                      <span>{file.sharedWith.length} users</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {file.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{file.description}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={loading}
            >
              <Download size={16} className="mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <Edit size={16} className="mr-2" />
              Rename
            </Button>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileDetailsModal;

