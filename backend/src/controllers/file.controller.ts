import { Request, Response } from 'express';
import mongoose from 'mongoose';
import File from '../models/File';
import User from '../models/User';
import { container } from 'tsyringe';
import { AzureStorageService } from '../services/azure-storage.service';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { FileQueryDto } from '../dto/file.dto'; // Add this import
import { error } from 'console';

// Service instances
const storageService = container.resolve(AzureStorageService);

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

/**
 * Middleware to handle file upload
 */
export const uploadMiddleware = upload.single('file');

/**
 * @desc    Create a new folder
 * @route   POST /api/files/folders
 * @access  Private
 */
export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, parent } = req.validatedBody;

    // Check if parent folder exists if provided
    if (parent) {
      const parentFolder = await File.findOne({ _id: parent, isFolder: true });
      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: 'Parent folder not found',
        });
      }

      // Check if the user has access to the parent folder
      if (
        parentFolder.owner.toString() !== req.user?.id &&
        !parentFolder.sharedWith.some(id => id.toString() === req.user?.id)
      ) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this folder',
        });
      }
    }

    // Create folder
    const folder = await File.create({
      name,
      owner: req.user?.id,
      parent: parent || null,
      isFolder: true,
    });

    res.status(201).json({
      success: true,
      message: 'Folder created successfully',
      data: folder,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Create a new file with direct upload
 * @route   POST /api/files
 * @access  Private
 */
export const createFile = async (req: Request, res: Response) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { parent } = req.body;
    const uploadedFile = req.file;
    
    // Check if parent folder exists if provided
    if (parent) {
      const parentFolder = await File.findOne({ _id: parent, isFolder: true });
      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: 'Parent folder not found',
        });
      }

      // Check if the user has access to the parent folder
      if (
        parentFolder.owner.toString() !== req.user?.id &&
        !parentFolder.sharedWith.some(id => id.toString() === req.user?.id)
      ) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this folder',
        });
      }
    }

    // Generate unique filename to prevent collisions
    const fileExtension = path.extname(uploadedFile.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = `${req.user?.id}/${Date.now()}-${fileName}`;

    // Upload the file directly to Azure Blob Storage
    await storageService.uploadFile(filePath, uploadedFile.buffer, uploadedFile.mimetype);

    // Create file record in database
    const file = await File.create({
      name: uploadedFile.originalname,
      type: uploadedFile.mimetype,
      size: uploadedFile.size,
      path: filePath,
      owner: req.user?.id,
      parent: parent || null,
      isFolder: false,
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get all files and folders for current user
 * @route   GET /api/files
 * @access  Private
 */
export const getFiles = async (req: Request, res: Response) => {
  try {
    const { search, parent, isFolder, shared, page = 1, limit = 10 } = req.query as any as FileQueryDto;
    
    // Build query
    const query: any = {
      $or: [
        { owner: req.user?.id },
        { sharedWith: req.user?.id },
      ],
    };
    
    // Add search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add parent filter
    if (parent !== undefined) {
      query.parent = parent || null;
    }
    
    // Add isFolder filter
    if (isFolder !== undefined) {
      query.isFolder = isFolder;
    }
    
    // Add shared filter
    if (shared) {
      query.sharedWith = req.user?.id;
    }
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const files = await File.find(query)
      .sort({ isFolder: -1, name: 1 }) // Folders first, then alphabetical
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email');
    
    // Get total count for pagination
    const total = await File.countDocuments(query);
    
    // Generate downloadUrls for files
    const filesWithDownloadUrls = await Promise.all(files.map(async (file) => {
      const fileObj = file.toObject();
      if (!fileObj.isFolder) {
        // Generate SAS URL for the file
        const downloadUrlInfo = await storageService.getDownloadUrl(fileObj.path);
        return {
          ...fileObj,
          downloadUrl: downloadUrlInfo
        };
      }
      return fileObj;
    }));
    
    res.status(200).json({
      success: true,
      count: total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total
      },
      data: filesWithDownloadUrls,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get a file or folder by ID
 * @route   GET /api/files/:id
 * @access  Private
 */
export const getFileById = async (req: Request, res: Response) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('sharedWith', 'name email');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File or folder not found',
      });
    }

    // Check if the user has access to the file
    if (
      file.owner.toString() !== req.user?.id &&
      !file.sharedWith.some(id => id.toString() === req.user?.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this file or folder',
      });
    }

    // If it's a file, generate download URL
    let downloadUrl = null;
    if (!file.isFolder) {
      downloadUrl = await storageService.getDownloadUrl(file.path);
    }

    res.status(200).json({
      success: true,
      data: {
        file,
        downloadUrl,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update a file or folder
 * @route   PUT /api/files/:id
 * @access  Private
 */
export const updateFile = async (req: Request, res: Response) => {
  try {
    const { name, parent } = req.validatedBody;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File or folder not found',
      });
    }

    // Check if the user is the owner of the file
    if (file.owner.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this file or folder',
      });
    }

    // Check if parent folder exists and user has access if provided
    if (parent) {
      // Prevent circular references
      if (file.isFolder && parent === file._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot set a folder as its own parent',
        });
      }

      const parentFolder = await File.findOne({ _id: parent, isFolder: true });
      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: 'Parent folder not found',
        });
      }

      // Check if the user has access to the parent folder
      if (parentFolder.owner.toString() !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to move to this folder',
        });
      }
    }

    // Update fields if provided
    if (name) file.name = name;
    if (parent !== undefined) file.parent = parent || null;

    await file.save();

    res.status(200).json({
      success: true,
      message: 'File or folder updated successfully',
      data: file,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete a file or folder
 * @route   DELETE /api/files/:id
 * @access  Private
 */
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File or folder not found',
      });
    }

    // Check if the user is the owner of the file
    if (file.owner.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this file or folder',
      });
    }

    // If it's a file, delete from storage
    if (!file.isFolder) {
      await storageService.deleteFile(file.path);
    }

    // Delete the file or folder (and its children if it's a folder)
    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: 'File or folder deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Share a file or folder with other users
 * @route   POST /api/files/:id/share
 * @access  Private
 */
export const shareFile = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.validatedBody;
    
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File or folder not found',
      });
    }

    // Check if the user is the owner of the file
    if (file.owner.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to share this file or folder',
      });
    }

    // Verify all users exist
    const users = await Promise.all(
      userIds.map((userId: string) => User.findById(userId))
    );
    if (users.some(user => user === null)) {
      return res.status(400).json({
        success: false,
        message: 'One or more users do not exist',
      });
    }

    // Add shared users to file
    file.sharedWith.push(...userIds.map((id: string) => new mongoose.Types.ObjectId(id) as any));
    await file.save();

    res.status(200).json({
      success: true,
      message: 'File or folder shared successfully',
      data: file,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Unshare a file or folder with a user
 * @route   DELETE /api/files/:id/share/:userId
 * @access  Private
 */
export const unshareFile = async (req: Request, res: Response) => {
  try {
    const file = await File.findById(req.params.id);
    const userId = req.params.userId; // Remove user from sharedWith array

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File or folder not found',
      });
    }

    // Check if the user is the owner of the file
    if (file.owner.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to unshare this file or folder',
      });
    }

    // Remove user from sharedWith array
    file.sharedWith = file.sharedWith.filter(
      (id) => id.toString() !== userId
    );

    await file.save();

    res.status(200).json({
      success: true,
      message: 'File or folder unshared successfully',
      data: file,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
