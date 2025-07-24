import { Request, Response } from 'express';
import User from '../models/User';
import { UserRole } from '../types';
import { PaginationDto } from '../dto/pagination.dto';

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query as any as PaginationDto;
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      count: total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total
      },
      data: users,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.validatedBody;
    
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role as UserRole;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting the current user
    if (user._id.toString() === req.user?.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete yourself',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
