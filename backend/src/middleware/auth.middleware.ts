import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { TokenService } from '../services/token.service';
import { UserRole } from '../types';

// Service instance
const tokenService = container.resolve(TokenService);

/**
 * Middleware to verify JWT token and authenticate requests
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = tokenService.verifyToken(token);
    
    // Set user id and role in request for use in protected routes
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

/**
 * Middleware to restrict access based on user roles
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action',
      });
    }
    next();
  };
};
