import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserDTO, UserWithoutPassword } from '../../domain/entities/User';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserWithoutPassword;
}

export class AuthService {
  private readonly saltRounds = 10;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(private userRepository: IUserRepository) {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-this';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  async register(data: CreateUserDTO): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user.id);

    // Return without password
    const { password, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Return without password
    const { password, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async validateToken(token: string): Promise<number> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: number };
      return decoded.userId;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }
}
