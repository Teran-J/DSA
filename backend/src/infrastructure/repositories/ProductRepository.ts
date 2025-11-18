import { IProductRepository } from '../../domain/repositories/IProductRepository';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilter,
} from '../../domain/entities/Product';
import prisma from '../database/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductRepository implements IProductRepository {
  async create(data: CreateProductDTO): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        baseModelUrl: data.baseModelUrl,
        availableColors: JSON.stringify(data.availableColors),
        price: new Decimal(data.price),
        thumbnailUrl: data.thumbnailUrl || null,
        description: data.description || null,
        active: data.active ?? true,
      },
    });

    return this.mapToEntity(product);
  }

  async findById(id: number): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product ? this.mapToEntity(product) : null;
  }

  async findAll(filter?: ProductFilter): Promise<Product[]> {
    const where: any = {};

    if (filter?.category) {
      where.category = filter.category;
    }

    if (filter?.active !== undefined) {
      where.active = filter.active;
    }

    if (filter?.minPrice !== undefined || filter?.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) {
        where.price.gte = new Decimal(filter.minPrice);
      }
      if (filter.maxPrice !== undefined) {
        where.price.lte = new Decimal(filter.maxPrice);
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return products.map(this.mapToEntity);
  }

  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.category) updateData.category = data.category;
    if (data.baseModelUrl) updateData.baseModelUrl = data.baseModelUrl;
    if (data.availableColors) updateData.availableColors = JSON.stringify(data.availableColors);
    if (data.price !== undefined) updateData.price = new Decimal(data.price);
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.active !== undefined) updateData.active = data.active;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(product);
  }

  async delete(id: number): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  private mapToEntity(product: any): Product {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      baseModelUrl: product.baseModelUrl,
      availableColors: JSON.parse(product.availableColors as string),
      price: product.price,
      thumbnailUrl: product.thumbnailUrl,
      description: product.description,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
