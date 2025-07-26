import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FolderPlus, Folder } from 'lucide-react';

const CreateFolderModal = ({ isOpen, onClose, onCreateFolder }) => {
  const [folderData, setFolderData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!folderData.name.trim()) {
      setError('Folder name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onCreateFolder(folderData);
      setFolderData({ name: '', description: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFolderData({ name: '', description: '' });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderPlus size={20} />
            <span>Create New Folder</span>
          </DialogTitle>
          <DialogDescription>
            Create a new folder to organize your files
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Folder Preview */}
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Folder size={40} className="text-white" />
            </div>
          </div>

          {/* Folder Name */}
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name *</Label>
            <Input
              id="folderName"
              placeholder="Enter folder name"
              value={folderData.name}
              onChange={(e) => setFolderData({ ...folderData, name: e.target.value })}
              disabled={loading}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Folder Description */}
          <div className="space-y-2">
            <Label htmlFor="folderDescription">Description (Optional)</Label>
            <Textarea
              id="folderDescription"
              placeholder="Enter folder description"
              value={folderData.description}
              onChange={(e) => setFolderData({ ...folderData, description: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !folderData.name.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Creating...' : 'Create Folder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderModal;

