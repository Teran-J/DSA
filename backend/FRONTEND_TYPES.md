# 📘 TypeScript Types para Frontend

Este documento contiene todos los tipos TypeScript que necesitas para integrar el frontend con el backend.

## 📦 Cómo Usar

Copia estos tipos en tu proyecto frontend, idealmente en:
- `src/types/api.ts` - Para tipos de API
- `src/types/entities.ts` - Para entidades del dominio

## 🔐 Autenticación

```typescript
// ============================================
// AUTH TYPES
// ============================================

export enum Role {
  CLIENT = 'CLIENT',
  DESIGNER = 'DESIGNER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
```

## 👕 Productos

```typescript
// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
  id: number;
  name: string;
  category: string;
  baseModelUrl: string;
  availableColors: string[];
  price: string; // Decimal as string
  thumbnailUrl: string | null;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
}

export interface ProductFilter {
  category?: string;
}
```

## 🎨 Diseños

```typescript
// ============================================
// DESIGN TYPES
// ============================================

export enum DesignStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Transforms {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface Design {
  id: number;
  userId: number;
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
  status: DesignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DesignWithRelations extends Design {
  user: {
    id: number;
    email: string;
    name: string | null;
  };
  product: {
    id: number;
    name: string;
    category: string;
    thumbnailUrl: string | null;
  };
}

export interface CreateDesignRequest {
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
}

export interface CreateDesignResponse {
  id: number;
  status: DesignStatus;
  createdAt: string;
}

export interface UserDesignsResponse {
  designs: DesignWithRelations[];
  total: number;
}
```

## ✅ Reviews

```typescript
// ============================================
// REVIEW TYPES
// ============================================

export enum ReviewStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Review {
  id: number;
  designId: number;
  reviewerId: number;
  status: ReviewStatus;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveDesignRequest {
  comment?: string;
}

export interface RejectDesignRequest {
  comment: string; // Required for rejection
}

export interface ReviewResponse {
  designId: number;
  status: ReviewStatus;
  reviewedAt: string;
}
```

## 📋 Ficha Técnica

```typescript
// ============================================
// TECHNICAL SHEET TYPES
// ============================================

export interface PrintArea {
  width: number;
  height: number;
  position: string;
}

export interface TechnicalSheet {
  designId: number;
  approvedAt: string;
  product: {
    id: number;
    name: string;
    category: string;
    baseModel: string;
  };
  specifications: {
    color: string;
    stampImageUrl: string;
    transforms: Transforms;
    printArea: PrintArea;
  };
  client: {
    id: number;
    name: string | null;
    email: string;
  };
  production: {
    estimatedQuantity: number;
    notes: string;
  };
}
```

## 📤 Upload

```typescript
// ============================================
// UPLOAD TYPES
// ============================================

export interface UploadResponse {
  url: string;
  filename: string;
}
```

## ❌ Error Types

```typescript
// ============================================
// ERROR TYPES
// ============================================

export interface ApiError {
  error: string;
  details?: any;
}

export interface ValidationError {
  error: string;
  details: Array<{
    field: string;
    message: string;
  }>;
}
```

## 🌐 API Response Wrappers

```typescript
// ============================================
// GENERIC API RESPONSE TYPES
// ============================================

export interface SuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  details?: any;
  statusCode: number;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Type guard
export function isErrorResponse(response: any): response is ErrorResponse {
  return 'error' in response;
}
```

## 🎯 Uso Completo - Archivo Consolidado

Aquí está todo en un solo archivo que puedes copiar directamente:

```typescript
// src/types/api.ts

// ============================================
// ENUMS
// ============================================

export enum Role {
  CLIENT = 'CLIENT',
  DESIGNER = 'DESIGNER',
  ADMIN = 'ADMIN',
}

export enum DesignStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ReviewStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// ============================================
// COMMON TYPES
// ============================================

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Transforms {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface PrintArea {
  width: number;
  height: number;
  position: string;
}

// ============================================
// USER & AUTH
// ============================================

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ============================================
// PRODUCTS
// ============================================

export interface Product {
  id: number;
  name: string;
  category: string;
  baseModelUrl: string;
  availableColors: string[];
  price: string;
  thumbnailUrl: string | null;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
}

export interface ProductFilter {
  category?: string;
}

// ============================================
// DESIGNS
// ============================================

export interface Design {
  id: number;
  userId: number;
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
  status: DesignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DesignWithRelations extends Design {
  user: {
    id: number;
    email: string;
    name: string | null;
  };
  product: {
    id: number;
    name: string;
    category: string;
    thumbnailUrl: string | null;
  };
}

export interface CreateDesignRequest {
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
}

export interface CreateDesignResponse {
  id: number;
  status: DesignStatus;
  createdAt: string;
}

export interface UserDesignsResponse {
  designs: DesignWithRelations[];
  total: number;
}

// ============================================
// REVIEWS
// ============================================

export interface Review {
  id: number;
  designId: number;
  reviewerId: number;
  status: ReviewStatus;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveDesignRequest {
  comment?: string;
}

export interface RejectDesignRequest {
  comment: string;
}

export interface ReviewResponse {
  designId: number;
  status: ReviewStatus;
  reviewedAt: string;
}

// ============================================
// TECHNICAL SHEET
// ============================================

export interface TechnicalSheet {
  designId: number;
  approvedAt: string;
  product: {
    id: number;
    name: string;
    category: string;
    baseModel: string;
  };
  specifications: {
    color: string;
    stampImageUrl: string;
    transforms: Transforms;
    printArea: PrintArea;
  };
  client: {
    id: number;
    name: string | null;
    email: string;
  };
  production: {
    estimatedQuantity: number;
    notes: string;
  };
}

// ============================================
// UPLOAD
// ============================================

export interface UploadResponse {
  url: string;
  filename: string;
}

// ============================================
// ERROR HANDLING
// ============================================

export interface ApiError {
  error: string;
  details?: any;
}

export interface ValidationError {
  error: string;
  details: Array<{
    field: string;
    message: string;
  }>;
}

export interface SuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  details?: any;
  statusCode: number;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function isErrorResponse(response: any): response is ErrorResponse {
  return 'error' in response;
}
```

## 🎨 Helpers de Transformaciones 3D

Funciones útiles para trabajar con transformaciones:

```typescript
// src/utils/transforms.ts

import { Transforms, Vector3 } from '../types/api';

export const defaultTransforms: Transforms = {
  position: { x: 0, y: 0.5, z: 0.1 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
};

export function createVector3(x: number = 0, y: number = 0, z: number = 0): Vector3 {
  return { x, y, z };
}

export function createDefaultTransforms(): Transforms {
  return {
    position: createVector3(),
    rotation: createVector3(),
    scale: createVector3(1, 1, 1),
  };
}

export function cloneTransforms(transforms: Transforms): Transforms {
  return {
    position: { ...transforms.position },
    rotation: { ...transforms.rotation },
    scale: { ...transforms.scale },
  };
}

export function updatePosition(
  transforms: Transforms,
  position: Partial<Vector3>
): Transforms {
  return {
    ...transforms,
    position: { ...transforms.position, ...position },
  };
}

export function updateRotation(
  transforms: Transforms,
  rotation: Partial<Vector3>
): Transforms {
  return {
    ...transforms,
    rotation: { ...transforms.rotation, ...rotation },
  };
}

export function updateScale(
  transforms: Transforms,
  scale: Partial<Vector3>
): Transforms {
  return {
    ...transforms,
    scale: { ...transforms.scale, ...scale },
  };
}
```

## 🔍 Type Guards

Funciones útiles para validación de tipos:

```typescript
// src/utils/typeGuards.ts

import { Role, DesignStatus, ReviewStatus } from '../types/api';

export function isRole(value: string): value is Role {
  return ['CLIENT', 'DESIGNER', 'ADMIN'].includes(value);
}

export function isDesignStatus(value: string): value is DesignStatus {
  return ['PENDING', 'APPROVED', 'REJECTED'].includes(value);
}

export function isReviewStatus(value: string): value is ReviewStatus {
  return ['APPROVED', 'REJECTED'].includes(value);
}

export function hasRequiredUserFields(obj: any): obj is { id: number; email: string } {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.email === 'string'
  );
}
```

## 💡 Constantes Útiles

```typescript
// src/constants/api.ts

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const DESIGN_STATUSES = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
} as const;

export const USER_ROLES = {
  CLIENT: 'Cliente',
  DESIGNER: 'Diseñador',
  ADMIN: 'Administrador',
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export const PRODUCT_CATEGORIES = [
  'camisetas',
  'hoodies',
  'polos',
  'tank-tops',
  'sudaderas',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
```

---

**Con estos tipos, tu frontend estará completamente tipado y sincronizado con el backend** 🚀
