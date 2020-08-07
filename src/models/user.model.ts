import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Order} from './order.model';
import {Shop} from './shop.model';
import {ShoppingCart} from './shopping-cart.model';

@model({
  settings: {
    indexes: {
      uniqueAccount: {
        keys: {
          account: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

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

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @hasMany(() => Order)
  orders: Order[];

  @hasMany(() => ShoppingCart)
  shoppingCarts: ShoppingCart[];

  @hasOne(() => Shop)
  shop: Shop;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
