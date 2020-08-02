import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Order,
  User,
} from '../models';
import {OrderRepository} from '../repositories';

export class OrderUserController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
  ) { }

  @get('/orders/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Order',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Order.prototype.id,
  ): Promise<User> {
    return this.orderRepository.user(id);
  }
}
