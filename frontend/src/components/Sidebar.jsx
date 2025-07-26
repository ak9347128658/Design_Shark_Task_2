import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  FolderOpen, 
  Home, 
  Image, 
  Video, 
  FileText, 
  Music,
  Archive,
  Star,
  Clock,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = ({ folders, onFolderClick, currentFolder }) => {
  const quickAccessItems = [
    { icon: Home, label: 'All Files', id: 'all', count: null },
    { icon: Image, label: 'Images', id: 'images', count: null },
    { icon: Video, label: 'Videos', id: 'videos', count: null },
    { icon: FileText, label: 'Documents', id: 'documents', count: null },
    { icon: Music, label: 'Audio', id: 'audio', count: null },
    { icon: Archive, label: 'Archives', id: 'archives', count: null },
  ];

  const recentItems = [
    { icon: Star, label: 'Starred', id: 'starred', count: null },
    { icon: Clock, label: 'Recent', id: 'recent', count: null },
    { icon: Trash2, label: 'Trash', id: 'trash', count: null },
  ];

  return (
    <div className="w-64 border-r border-border bg-card/50 p-4 space-y-6">
      {/* Quick Access */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Quick Access
        </h3>
        <div className="space-y-1">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            const isActive = !currentFolder && item.id === 'all';
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9 px-3",
                  isActive && "bg-accent text-accent-foreground"
                )}
                onClick={() => item.id === 'all' && onFolderClick(null)}
              >
                <Icon size={16} className="mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Folders */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Folders
        </h3>
        <div className="space-y-1">
          {folders.map((folder) => {
            const isActive = currentFolder?._id === folder._id;
            const Icon = isActive ? FolderOpen : Folder;
            
            return (
              <Button
                key={folder._id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9 px-3",
                  isActive && "bg-accent text-accent-foreground"
                )}
                onClick={() => onFolderClick(folder)}
              >
                <Icon size={16} className="mr-3 text-blue-500" />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                {folder.itemCount && (
                  <Badge variant="secondary" className="ml-auto">
                    {folder.itemCount}
                  </Badge>
                )}
              </Button>
            );
          })}
          
          {folders.length === 0 && (
            <div className="text-center py-4">
              <Folder size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No folders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent & Starred */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Recent & Starred
        </h3>
        <div className="space-y-1">
          {recentItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start h-9 px-3"
              >
                <Icon size={16} className="mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Storage Info */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-800 dark:text-red-200">Storage</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-red-700 dark:text-red-300">Used</span>
              <span className="text-red-700 dark:text-red-300">2.4 GB of 15 GB</span>
            </div>
            <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '16%' }}></div>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs">
              Upgrade Storage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;

