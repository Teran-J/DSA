import { Transforms } from './Design';

export interface PrintArea {
  width: number;
  height: number;
  position: string;
}

export interface TechnicalSheet {
  designId: number;
  approvedAt: string;
  product: {
    id: number;
    name: string;
    category: string;
    baseModel: string;
  };
  specifications: {
    color: string;
    stampImageUrl: string;
    transforms: Transforms;
    printArea: PrintArea;
  };
  client: {
    id: number;
    name: string | null;
    email: string;
  };
  production: {
    estimatedQuantity: number;
    notes: string;
  };
}
