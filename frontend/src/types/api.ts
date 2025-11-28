// src/types/api.ts

// ============================================
// ENUMS
// ============================================

export const Role = {
    CLIENT: 'CLIENT',
    DESIGNER: 'DESIGNER',
    ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const DesignStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

export type DesignStatus = (typeof DesignStatus)[keyof typeof DesignStatus];

export const ReviewStatus = {
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

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
