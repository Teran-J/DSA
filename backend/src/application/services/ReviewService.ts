import { IReviewRepository } from '../../domain/repositories/IReviewRepository';
import { IDesignRepository } from '../../domain/repositories/IDesignRepository';
import { Review, ReviewStatus } from '../../domain/entities/Review';
import { DesignStatus } from '../../domain/entities/Design';
import { TechnicalSheet } from '../../domain/entities/TechnicalSheet';

export interface ApproveDesignDTO {
  designId: number;
  reviewerId: number;
  comment?: string;
}

export interface RejectDesignDTO {
  designId: number;
  reviewerId: number;
  comment: string;
}

export class ReviewService {
  constructor(
    private reviewRepository: IReviewRepository,
    private designRepository: IDesignRepository
  ) {}

  async approveDesign(data: ApproveDesignDTO): Promise<Review> {
    const design = await this.designRepository.findById(data.designId);

    if (!design) {
      throw new Error('Design not found');
    }

    if (design.status !== DesignStatus.PENDING) {
      throw new Error('Only pending designs can be reviewed');
    }

    // Update design status
    await this.designRepository.update(data.designId, {
      status: DesignStatus.APPROVED,
    });

    // Create review
    const review = await this.reviewRepository.create({
      designId: data.designId,
      reviewerId: data.reviewerId,
      status: ReviewStatus.APPROVED,
      comment: data.comment,
    });

    return review;
  }

  async rejectDesign(data: RejectDesignDTO): Promise<Review> {
    const design = await this.designRepository.findById(data.designId);

    if (!design) {
      throw new Error('Design not found');
    }

    if (design.status !== DesignStatus.PENDING) {
      throw new Error('Only pending designs can be reviewed');
    }

    // Update design status
    await this.designRepository.update(data.designId, {
      status: DesignStatus.REJECTED,
    });

    // Create review
    const review = await this.reviewRepository.create({
      designId: data.designId,
      reviewerId: data.reviewerId,
      status: ReviewStatus.REJECTED,
      comment: data.comment,
    });

    return review;
  }

  async getDesignReviews(designId: number): Promise<Review[]> {
    return this.reviewRepository.findByDesignId(designId);
  }

  async generateTechnicalSheet(designId: number): Promise<TechnicalSheet> {
    const design = await this.designRepository.findByIdWithRelations(designId);

    if (!design) {
      throw new Error('Design not found');
    }

    if (design.status !== DesignStatus.APPROVED) {
      throw new Error('Only approved designs can generate technical sheets');
    }

    const reviews = await this.reviewRepository.findByDesignId(designId);
    const approvedReview = reviews.find((r) => r.status === ReviewStatus.APPROVED);

    if (!approvedReview) {
      throw new Error('No approval review found');
    }

    // Calculate print area based on transforms
    const printArea = this.calculatePrintArea(design.transforms);

    const technicalSheet: TechnicalSheet = {
      designId: design.id,
      approvedAt: approvedReview.createdAt.toISOString(),
      product: {
        id: design.product.id,
        name: design.product.name,
        category: design.product.category,
        baseModel: design.product.thumbnailUrl || '',
      },
      specifications: {
        color: design.color,
        stampImageUrl: design.imageUrl,
        transforms: design.transforms,
        printArea,
      },
      client: {
        id: design.user.id,
        name: design.user.name,
        email: design.user.email,
      },
      production: {
        estimatedQuantity: 1,
        notes: approvedReview.comment || 'No additional notes',
      },
    };

    return technicalSheet;
  }

  private calculatePrintArea(transforms: any): { width: number; height: number; position: string } {
    // Simple calculation based on scale
    const baseWidth = 30; // cm
    const baseHeight = 40; // cm

    return {
      width: baseWidth * transforms.scale.x,
      height: baseHeight * transforms.scale.y,
      position: 'center-front',
    };
  }
}
