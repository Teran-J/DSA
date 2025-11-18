import { Request, Response } from 'express';
import { ProductService } from '../../application/services/ProductService';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';

export class ProductController {
  private productService: ProductService;

  constructor() {
    const productRepository = new ProductRepository();
    this.productService = new ProductService(productRepository);
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.query;

      const products = await this.productService.getAllProducts({
        category: category as string | undefined,
      });

      res.status(200).json({
        products,
        total: products.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(parseInt(id));

      res.status(200).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
