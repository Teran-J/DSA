import { IReviewRepository } from '../../domain/repositories/IReviewRepository';
import { Review, CreateReviewDTO, ReviewWithRelations, ReviewStatus } from '../../domain/entities/Review';
import prisma from '../database/prisma';

export class ReviewRepository implements IReviewRepository {
  async create(data: CreateReviewDTO): Promise<Review> {
    const review = await prisma.review.create({
      data: {
        designId: data.designId,
        reviewerId: data.reviewerId,
        status: data.status,
        comment: data.comment || null,
      },
    });

    return this.mapToEntity(review);
  }

  async findById(id: number): Promise<Review | null> {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    return review ? this.mapToEntity(review) : null;
  }

  async findByDesignId(designId: number): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      where: { designId },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(this.mapToEntity);
  }

  async findByDesignIdWithRelations(designId: number): Promise<ReviewWithRelations[]> {
    const reviews = await prisma.review.findMany({
      where: { designId },
      include: {
        reviewer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        design: {
          select: {
            id: true,
            userId: true,
            productId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(this.mapToEntityWithRelations);
  }

  async findAll(): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(this.mapToEntity);
  }

  private mapToEntity(review: any): Review {
    return {
      id: review.id,
      designId: review.designId,
      reviewerId: review.reviewerId,
      status: review.status as ReviewStatus,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  private mapToEntityWithRelations(review: any): ReviewWithRelations {
    return {
      ...this.mapToEntity(review),
      reviewer: review.reviewer,
      design: review.design,
    };
  }
}
