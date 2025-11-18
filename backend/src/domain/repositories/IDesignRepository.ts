import {
  Design,
  CreateDesignDTO,
  UpdateDesignDTO,
  DesignWithRelations,
  DesignFilter,
} from '../entities/Design';

export interface IDesignRepository {
  create(data: CreateDesignDTO): Promise<Design>;
  findById(id: number): Promise<Design | null>;
  findByIdWithRelations(id: number): Promise<DesignWithRelations | null>;
  findAll(filter?: DesignFilter): Promise<Design[]>;
  findAllWithRelations(filter?: DesignFilter): Promise<DesignWithRelations[]>;
  update(id: number, data: UpdateDesignDTO): Promise<Design>;
  delete(id: number): Promise<void>;
}
