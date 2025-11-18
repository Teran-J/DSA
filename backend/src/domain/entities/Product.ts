import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
  id: number;
  name: string;
  category: string;
  baseModelUrl: string;
  availableColors: string[];
  price: Decimal;
  thumbnailUrl: string | null;
  description: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  category: string;
  baseModelUrl: string;
  availableColors: string[];
  price: number;
  thumbnailUrl?: string;
  description?: string;
  active?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  category?: string;
  baseModelUrl?: string;
  availableColors?: string[];
  price?: number;
  thumbnailUrl?: string;
  description?: string;
  active?: boolean;
}

export interface ProductFilter {
  category?: string;
  active?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page?: number;
  limit?: number;
}
