import {Entity, model, property, hasMany} from '@loopback/repository';
import {Product} from './product.model';

@model()
export class Shop extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  address?: string;

  @hasMany(() => Product)
  products: Product[];

  constructor(data?: Partial<Shop>) {
    super(data);
  }
}

export interface ShopRelations {
  // describe navigational properties here
}

export type ShopWithRelations = Shop & ShopRelations;
