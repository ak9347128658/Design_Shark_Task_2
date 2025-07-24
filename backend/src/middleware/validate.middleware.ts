import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * Middleware for validating request DTOs using class-validator
 */
export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Convert request body to DTO instance
    const dtoObject = plainToInstance(dtoClass, req.body);
    
    // Validate
    const errors: ValidationError[] = await validate(dtoObject, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    
    // If there are validation errors, return them
    if (errors.length > 0) {
      const validationErrors: Record<string, string[]> = {};
      
      errors.forEach((error: ValidationError) => {
        if (error.constraints) {
          validationErrors[error.property] = Object.values(error.constraints);
        }
      });
      
      return res.status(400).json({
        success: false,
        errors: validationErrors,
        message: 'Validation failed',
      });
    }
    
    // Add validated object to request for further use
    req.validatedBody = dtoObject;
    next();
  };
}

// Add custom property to Express Request interface
declare global {
  namespace Express {
    interface Request {
      validatedBody: any;
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
