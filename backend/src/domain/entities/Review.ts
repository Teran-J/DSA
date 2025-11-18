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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewDTO {
  designId: number;
  reviewerId: number;
  status: ReviewStatus;
  comment?: string;
}

export interface ReviewWithRelations extends Review {
  reviewer: {
    id: number;
    email: string;
    name: string | null;
  };
  design: {
    id: number;
    userId: number;
    productId: number;
  };
}
