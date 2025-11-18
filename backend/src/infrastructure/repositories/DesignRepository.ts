import { IDesignRepository } from '../../domain/repositories/IDesignRepository';
import {
  Design,
  CreateDesignDTO,
  UpdateDesignDTO,
  DesignWithRelations,
  DesignFilter,
  DesignStatus,
  Transforms,
} from '../../domain/entities/Design';
import prisma from '../database/prisma';

export class DesignRepository implements IDesignRepository {
  async create(data: CreateDesignDTO): Promise<Design> {
    const design = await prisma.design.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        color: data.color,
        imageUrl: data.imageUrl,
        transforms: JSON.stringify(data.transforms),
        status: DesignStatus.PENDING,
      },
    });

    return this.mapToEntity(design);
  }

  async findById(id: number): Promise<Design | null> {
    const design = await prisma.design.findUnique({
      where: { id },
    });

    return design ? this.mapToEntity(design) : null;
  }

  async findByIdWithRelations(id: number): Promise<DesignWithRelations | null> {
    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    return design ? this.mapToEntityWithRelations(design) : null;
  }

  async findAll(filter?: DesignFilter): Promise<Design[]> {
    const where: any = {};

    if (filter?.userId) {
      where.userId = filter.userId;
    }

    if (filter?.productId) {
      where.productId = filter.productId;
    }

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.dateFrom || filter?.dateTo) {
      where.createdAt = {};
      if (filter.dateFrom) {
        where.createdAt.gte = filter.dateFrom;
      }
      if (filter.dateTo) {
        where.createdAt.lte = filter.dateTo;
      }
    }

    const designs = await prisma.design.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return designs.map(this.mapToEntity);
  }

  async findAllWithRelations(filter?: DesignFilter): Promise<DesignWithRelations[]> {
    const where: any = {};

    if (filter?.userId) {
      where.userId = filter.userId;
    }

    if (filter?.productId) {
      where.productId = filter.productId;
    }

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.dateFrom || filter?.dateTo) {
      where.createdAt = {};
      if (filter.dateFrom) {
        where.createdAt.gte = filter.dateFrom;
      }
      if (filter.dateTo) {
        where.createdAt.lte = filter.dateTo;
      }
    }

    const designs = await prisma.design.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            thumbnailUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return designs.map(this.mapToEntityWithRelations);
  }

  async update(id: number, data: UpdateDesignDTO): Promise<Design> {
    const updateData: any = {};

    if (data.color) updateData.color = data.color;
    if (data.imageUrl) updateData.imageUrl = data.imageUrl;
    if (data.transforms) updateData.transforms = JSON.stringify(data.transforms);
    if (data.status) updateData.status = data.status;

    const design = await prisma.design.update({
      where: { id },
      data: updateData,
    });

    return this.mapToEntity(design);
  }

  async delete(id: number): Promise<void> {
    await prisma.design.delete({
      where: { id },
    });
  }

  private mapToEntity(design: any): Design {
    return {
      id: design.id,
      userId: design.userId,
      productId: design.productId,
      color: design.color,
      imageUrl: design.imageUrl,
      transforms: JSON.parse(design.transforms as string) as Transforms,
      status: design.status as DesignStatus,
      createdAt: design.createdAt,
      updatedAt: design.updatedAt,
    };
  }

  private mapToEntityWithRelations(design: any): DesignWithRelations {
    return {
      ...this.mapToEntity(design),
      user: design.user,
      product: design.product,
    };
  }
}
