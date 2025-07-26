import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  Video, 
  Music, 
  FileText,
  Archive,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FileUploadModal = ({ isOpen, onClose, onUpload, currentFolder }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('audio/')) return Music;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    if (file.type.includes('zip') || file.type.includes('rar')) return Archive;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const removeFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const updateFileName = (fileId, newName) => {
    setFiles(files.map(f => 
      f.id === fileId ? { ...f, name: newName } : f
    ));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileObjects = files.map(f => {
        // Create a new File object with the updated name
        const newFile = new File([f.file], f.name, { type: f.file.type });
        return newFile;
      });

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onUpload(fileObjects, currentFolder?._id);
      
      // Reset state
      setFiles([]);
      setUploadProgress(0);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload size={20} />
            <span>Add Files</span>
          </DialogTitle>
          <DialogDescription>
            Upload files to {currentFolder ? currentFolder.name : 'All Files'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-red-500 bg-red-50 dark:bg-red-950/20" 
                : "border-gray-300 dark:border-gray-600 hover:border-red-400"
            )}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <Upload size={32} className="text-red-600" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to select files
                </p>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="flex-1 overflow-y-auto space-y-2">
              <h4 className="font-medium text-sm">Files to upload ({files.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((fileItem) => {
                  const FileIcon = getFileIcon(fileItem.file);
                  return (
                    <div key={fileItem.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileIcon size={20} className="text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Input
                          value={fileItem.name}
                          onChange={(e) => updateFileName(fileItem.id, e.target.value)}
                          className="h-8 text-sm"
                          disabled={uploading}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(fileItem.size)}
                        </p>
                      </div>
                      {fileItem.status === 'uploaded' ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileItem.id)}
                          disabled={uploading}
                          className="h-8 w-8 p-0"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={files.length === 0 || uploading}
            className="bg-red-600 hover:bg-red-700"
          >
            {uploading ? 'Uploading...' : `Add Files (${files.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;

