import { Router } from 'express';
import {
  createFolder,
  createFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  shareFile,
  unshareFile,
} from '../controllers/file.controller';
import { auth } from '../middleware/auth.middleware';
import { validateDto } from '../middleware/validate.middleware';
import { 
  CreateFolderDto, 
  CreateFileDto, 
  UpdateFileDto,
  ShareFileDto
} from '../dto/file.dto';

const router = Router();

/**
 * @swagger
 * /files/folders:
 *   post:
 *     summary: Create a new folder
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFolderDto'
 *     responses:
 *       201:
 *         description: Folder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/File'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 */
router.post('/folders', auth, validateDto(CreateFolderDto), createFolder);

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Create a new file (get upload URL)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFileDto'
 *     responses:
 *       201:
 *         description: File entry created and upload URL generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     file:
 *                       $ref: '#/components/schemas/File'
 *                     uploadUrl:
 *                       $ref: '#/components/schemas/PresignedUrl'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 */
router.post('/', auth, validateDto(CreateFileDto), createFile);

/**
 * @swagger
 * /files:
 *   get:
 *     summary: Get all files and folders for the current user
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for file/folder names
 *       - in: query
 *         name: parent
 *         schema:
 *           type: string
 *         description: Parent folder ID (null for root)
 *       - in: query
 *         name: isFolder
 *         schema:
 *           type: boolean
 *         description: Filter by folders or files
 *       - in: query
 *         name: shared
 *         schema:
 *           type: boolean
 *         description: Only show shared files/folders
 *     responses:
 *       200:
 *         description: List of files and folders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/File'
 *       401:
 *         description: Not authorized
 */
router.get('/', auth, getFiles);

/**
 * @swagger
 * /files/{id}:
 *   get:
 *     summary: Get a file or folder by ID
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The file or folder ID
 *     responses:
 *       200:
 *         description: File or folder details with download URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     file:
 *                       $ref: '#/components/schemas/File'
 *                     downloadUrl:
 *                       $ref: '#/components/schemas/PresignedUrl'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - No access
 *       404:
 *         description: File or folder not found
 */
router.get('/:id', auth, getFileById);

/**
 * @swagger
 * /files/{id}:
 *   put:
 *     summary: Update a file or folder
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The file or folder ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFileDto'
 *     responses:
 *       200:
 *         description: File or folder updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/File'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: File or folder not found
 */
router.put('/:id', auth, validateDto(UpdateFileDto), updateFile);

/**
 * @swagger
 * /files/{id}:
 *   delete:
 *     summary: Delete a file or folder
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The file or folder ID
 *     responses:
 *       200:
 *         description: File or folder deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: File or folder not found
 */
router.delete('/:id', auth, deleteFile);

/**
 * @swagger
 * /files/{id}/share:
 *   post:
 *     summary: Share a file or folder with other users
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The file or folder ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShareFileDto'
 *     responses:
 *       200:
 *         description: File or folder shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/File'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: File, folder, or user not found
 */
router.post('/:id/share', auth, validateDto(ShareFileDto), shareFile);

/**
 * @swagger
 * /files/{id}/share/{userId}:
 *   delete:
 *     summary: Unshare a file or folder with a user
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The file or folder ID
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID to unshare with
 *     responses:
 *       200:
 *         description: File or folder unshared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/File'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: File or folder not found
 */
router.delete('/:id/share/:userId', auth, unshareFile);

export default router;
