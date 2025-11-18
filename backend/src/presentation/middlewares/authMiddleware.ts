import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const userId = await authService.validateToken(token);

    // Get user to check role
    const user = await userRepository.findById(userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.userId = userId;
    req.userRole = user.role;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
