import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ShoppingCart,
  User,
} from '../models';
import {ShoppingCartRepository} from '../repositories';

export class ShoppingCartUserController {
  constructor(
    @repository(ShoppingCartRepository)
    public shoppingCartRepository: ShoppingCartRepository,
  ) { }

  @get('/shopping-carts/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ShoppingCart',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof ShoppingCart.prototype.id,
  ): Promise<User> {
    return this.shoppingCartRepository.user(id);
  }
}
