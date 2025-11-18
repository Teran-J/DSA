export enum Role {
  CLIENT = 'CLIENT',
  DESIGNER = 'DESIGNER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface CreateUserDTO {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  role?: Role;
}
