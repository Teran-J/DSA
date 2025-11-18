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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDesignDTO {
  userId: number;
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
}

export interface UpdateDesignDTO {
  color?: string;
  imageUrl?: string;
  transforms?: Transforms;
  status?: DesignStatus;
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

export interface DesignFilter {
  userId?: number;
  productId?: number;
  status?: DesignStatus;
  dateFrom?: Date;
  dateTo?: Date;
}
