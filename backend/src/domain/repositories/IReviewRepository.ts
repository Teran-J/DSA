import { Review, CreateReviewDTO, ReviewWithRelations } from '../entities/Review';

export interface IReviewRepository {
  create(data: CreateReviewDTO): Promise<Review>;
  findById(id: number): Promise<Review | null>;
  findByDesignId(designId: number): Promise<Review[]>;
  findByDesignIdWithRelations(designId: number): Promise<ReviewWithRelations[]>;
  findAll(): Promise<Review[]>;
}
