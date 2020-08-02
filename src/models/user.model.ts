import {Entity, model, property, hasMany} from '@loopback/repository';
import {Order} from './order.model';
import {ShoppingCart} from './shopping-cart.model';

@model()
export class User extends Entity {
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
  account: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @hasMany(() => Order)
  orders: Order[];

  @hasMany(() => ShoppingCart)
  shoppingCarts: ShoppingCart[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
