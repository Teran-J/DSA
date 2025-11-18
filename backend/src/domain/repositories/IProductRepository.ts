import { Product, CreateProductDTO, UpdateProductDTO, ProductFilter } from '../entities/Product';

export interface IProductRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findAll(filter?: ProductFilter): Promise<Product[]>;
  update(id: number, data: UpdateProductDTO): Promise<Product>;
  delete(id: number): Promise<void>;
}
