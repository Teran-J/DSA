import { Role } from '../../domain/entities/User';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: Role;
    }
  }
}
