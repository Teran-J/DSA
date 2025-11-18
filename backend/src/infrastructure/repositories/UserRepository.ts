import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, CreateUserDTO, UpdateUserDTO, Role } from '../../domain/entities/User';
import prisma from '../database/prisma';

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name || null,
        role: data.role || Role.CLIENT,
      },
    });

    return this.mapToEntity(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapToEntity(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(this.mapToEntity);
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return this.mapToEntity(user);
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  private mapToEntity(user: any): User {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role as Role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
