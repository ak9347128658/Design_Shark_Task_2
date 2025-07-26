import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import FileGrid from '../components/FileGrid';
import Sidebar from '../components/Sidebar';
import FileUploadModal from '../components/FileUploadModal';
import CreateFolderModal from '../components/CreateFolderModal';
import FileDetailsModal from '../components/FileDetailsModal';
import { fileService } from '../services/fileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Upload,
  FolderPlus,
  Home,
  ChevronRight
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isFileDetailsModalOpen, setIsFileDetailsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Redirect admin users to admin dashboard
    if (user?.role === 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchFiles();
  }, [user, currentFolder]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await fileService.getFiles(currentFolder?._id);
      
      // Separate folders and files
      const folderItems = data.filter(item => item.type === 'folder');
      const fileItems = data.filter(item => item.type === 'file');
      
      setFolders(folderItems);
      setFiles(fileItems);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setBreadcrumbs([...breadcrumbs, folder]);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      // Home clicked
      setCurrentFolder(null);
      setBreadcrumbs([]);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1] || null);
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setIsFileDetailsModalOpen(true);
  };

  const handleCreateFolder = async (folderData) => {
    try {
      await fileService.createFolder({
        ...folderData,
        parent: currentFolder?._id
      });
      fetchFiles();
      setIsCreateFolderModalOpen(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleFileUpload = async (files, parentId) => {
    try {
      for (const file of files) {
        await fileService.uploadFile(file, parentId || currentFolder?._id);
      }
      fetchFiles();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await fileService.deleteFile(itemId);
      fetchFiles();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar 
          folders={folders}
          onFolderClick={handleFolderClick}
          currentFolder={currentFolder}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-6 space-y-4">
            {/* Breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => handleBreadcrumbClick(-1)}
                    className="cursor-pointer flex items-center"
                  >
                    <Home size={16} className="mr-1" />
                    All Files
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((folder, index) => (
                  <React.Fragment key={folder._id}>
                    <BreadcrumbSeparator>
                      <ChevronRight size={16} />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink 
                          onClick={() => handleBreadcrumbClick(index)}
                          className="cursor-pointer"
                        >
                          {folder.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">
                  {currentFolder ? currentFolder.name : 'All Files'}
                </h1>
                <div className="text-sm text-muted-foreground">
                  {filteredFolders.length + filteredFiles.length} items
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List size={16} />
                  </Button>
                </div>

                {/* Action Buttons */}
                <Button
                  onClick={() => setIsCreateFolderModalOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  <FolderPlus size={16} className="mr-2" />
                  Create Folder
                </Button>

                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Upload size={16} className="mr-2" />
                  Add Files
                </Button>
              </div>
            </div>
          </div>

          {/* File Grid */}
          <div className="flex-1 p-6">
            <FileGrid
              folders={filteredFolders}
              files={filteredFiles}
              viewMode={viewMode}
              loading={loading}
              onFolderClick={handleFolderClick}
              onFileClick={handleFileClick}
              onDeleteItem={handleDeleteItem}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
        currentFolder={currentFolder}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <FileDetailsModal
        isOpen={isFileDetailsModalOpen}
        onClose={() => setIsFileDetailsModalOpen(false)}
        file={selectedFile}
        onDelete={handleDeleteItem}
      />
    </Layout>
  );
};

export default Dashboard;

