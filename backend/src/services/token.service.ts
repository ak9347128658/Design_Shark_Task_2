import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { UserRole, IDecodedToken } from '../types';
import { injectable } from 'tsyringe';

@injectable()
export class TokenService {
  /**
   * Generate JWT token
   */
  generateToken(id: string, role: UserRole): string {
    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'],
    };
    
    return jwt.sign(
      { id, role },
      process.env.JWT_SECRET as Secret,
      options
    );
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): IDecodedToken {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as IDecodedToken;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
