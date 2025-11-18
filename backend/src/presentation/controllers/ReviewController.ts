import { Request, Response } from 'express';
import { ReviewService } from '../../application/services/ReviewService';
import { ReviewRepository } from '../../infrastructure/repositories/ReviewRepository';
import { DesignRepository } from '../../infrastructure/repositories/DesignRepository';
import { z } from 'zod';

const approveSchema = z.object({
  comment: z.string().optional(),
});

const rejectSchema = z.object({
  comment: z.string().min(1, 'Comment is required for rejection'),
});

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    const reviewRepository = new ReviewRepository();
    const designRepository = new DesignRepository();
    this.reviewService = new ReviewService(reviewRepository, designRepository);
  }

  approve = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { designId } = req.params;
      const validatedData = approveSchema.parse(req.body);

      const review = await this.reviewService.approveDesign({
        designId: parseInt(designId),
        reviewerId: req.userId,
        comment: validatedData.comment,
      });

      res.status(200).json({
        designId: review.designId,
        status: review.status,
        reviewedAt: review.createdAt,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };

  reject = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { designId } = req.params;
      const validatedData = rejectSchema.parse(req.body);

      const review = await this.reviewService.rejectDesign({
        designId: parseInt(designId),
        reviewerId: req.userId,
        comment: validatedData.comment,
      });

      res.status(200).json({
        designId: review.designId,
        status: review.status,
        reviewedAt: review.createdAt,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getTechnicalSheet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { designId } = req.params;

      const technicalSheet = await this.reviewService.generateTechnicalSheet(parseInt(designId));

      res.status(200).json(technicalSheet);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
