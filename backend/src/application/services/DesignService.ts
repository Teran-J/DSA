import { IDesignRepository } from '../../domain/repositories/IDesignRepository';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import {
  Design,
  CreateDesignDTO,
  UpdateDesignDTO,
  DesignWithRelations,
  DesignFilter,
  DesignStatus,
} from '../../domain/entities/Design';
import { Role } from '../../domain/entities/User';

export class DesignService {
  constructor(
    private designRepository: IDesignRepository,
    private productRepository: IProductRepository
  ) {}

  async createDesign(data: CreateDesignDTO): Promise<Design> {
    // Validate product exists
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Validate color is available for this product
    if (!product.availableColors.includes(data.color)) {
      throw new Error(`Color ${data.color} is not available for this product`);
    }

    return this.designRepository.create(data);
  }

  async getDesignById(id: number, userId: number, userRole: Role): Promise<DesignWithRelations> {
    const design = await this.designRepository.findByIdWithRelations(id);

    if (!design) {
      throw new Error('Design not found');
    }

    // Authorization: users can only see their own designs unless they are designer/admin
    if (userRole === Role.CLIENT && design.userId !== userId) {
      throw new Error('Unauthorized to view this design');
    }

    return design;
  }

  async getUserDesigns(userId: number): Promise<DesignWithRelations[]> {
    return this.designRepository.findAllWithRelations({ userId });
  }

  async getPendingDesigns(): Promise<DesignWithRelations[]> {
    return this.designRepository.findAllWithRelations({ status: DesignStatus.PENDING });
  }

  async getAllDesigns(filter?: DesignFilter): Promise<DesignWithRelations[]> {
    return this.designRepository.findAllWithRelations(filter);
  }

  async updateDesign(
    id: number,
    data: UpdateDesignDTO,
    userId: number,
    userRole: Role
  ): Promise<Design> {
    const design = await this.designRepository.findById(id);

    if (!design) {
      throw new Error('Design not found');
    }

    // Authorization: only owner can update (unless admin)
    if (userRole === Role.CLIENT && design.userId !== userId) {
      throw new Error('Unauthorized to update this design');
    }

    // Clients cannot change status of their designs
    if (userRole === Role.CLIENT && data.status) {
      throw new Error('Clients cannot change design status');
    }

    return this.designRepository.update(id, data);
  }

  async deleteDesign(id: number, userId: number, userRole: Role): Promise<void> {
    const design = await this.designRepository.findById(id);

    if (!design) {
      throw new Error('Design not found');
    }

    // Authorization: only owner can delete (unless admin)
    if (userRole === Role.CLIENT && design.userId !== userId) {
      throw new Error('Unauthorized to delete this design');
    }

    await this.designRepository.delete(id);
  }
}
