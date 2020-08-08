import {belongsTo, Entity, model, property} from '@loopback/repository';
import {OrderItem} from './order-item.model';
import {User} from './user.model';
// export interface OrderItem{
//   productName:string,
//   price:number,
//   quantity:number
// }
@model()
export class Order extends Entity {
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
  fullName: string;

  @property({
    type: 'string',
    required: true,
  })
  shopName: string;

  @property({
    type: 'string',
    required: true,
  })
  shopId: string;

  @property.array(OrderItem, {required: true})
  orderItem: OrderItem[];


  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
