import { Request, Response } from 'express';
import { DesignService } from '../../application/services/DesignService';
import { DesignRepository } from '../../infrastructure/repositories/DesignRepository';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { z } from 'zod';
import { DesignStatus } from '../../domain/entities/Design';

const vector3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const transformsSchema = z.object({
  position: vector3Schema,
  rotation: vector3Schema,
  scale: vector3Schema,
});

const createDesignSchema = z.object({
  productId: z.number().int().positive(),
  color: z.string().min(1),
  imageUrl: z.string().url(),
  transforms: transformsSchema,
});

export class DesignController {
  private designService: DesignService;

  constructor() {
    const designRepository = new DesignRepository();
    const productRepository = new ProductRepository();
    this.designService = new DesignService(designRepository, productRepository);
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validatedData = createDesignSchema.parse(req.body);

      const design = await this.designService.createDesign({
        ...validatedData,
        userId: req.userId,
      });

      res.status(201).json({
        id: design.id,
        status: design.status,
        createdAt: design.createdAt,
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

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.userId || !req.userRole) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const design = await this.designService.getDesignById(
        parseInt(id),
        req.userId,
        req.userRole
      );

      res.status(200).json(design);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Unauthorized to view this design') {
          res.status(403).json({ error: error.message });
          return;
        }
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getUserDesigns = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const designs = await this.designService.getUserDesigns(req.userId);

      res.status(200).json({
        designs,
        total: designs.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getPendingDesigns = async (req: Request, res: Response): Promise<void> => {
    try {
      const designs = await this.designService.getPendingDesigns();

      res.status(200).json({
        designs,
        total: designs.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
