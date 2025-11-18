import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product, ProductFilter, CreateProductDTO, UpdateProductDTO } from '../../domain/entities/Product';

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts(filter?: ProductFilter): Promise<Product[]> {
    // By default, only show active products
    const activeFilter = filter?.active !== undefined ? filter.active : true;

    return this.productRepository.findAll({
      ...filter,
      active: activeFilter,
    });
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(data: CreateProductDTO): Promise<Product> {
    return this.productRepository.create(data);
  }

  async updateProduct(id: number, data: UpdateProductDTO): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: number): Promise<void> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    await this.productRepository.delete(id);
  }
}
