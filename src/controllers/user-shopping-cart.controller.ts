import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {ShoppingCart} from '../models';
import {ShoppingCartRepository, UserRepository} from '../repositories';

export class UserShoppingCartController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(ShoppingCartRepository) protected shoppingCartRepository: ShoppingCartRepository,
  ) {}

  @get('/users/{id}/shopping-carts', {
    responses: {
      '200': {
        description: 'Array of User has many ShoppingCart',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ShoppingCart)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ShoppingCart>,
  ): Promise<ShoppingCart[]> {
    return this.userRepository.shoppingCarts(id).find(filter);
  }

  @post('/users/{id}/shopping-carts', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(ShoppingCart)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ShoppingCart, {
            title: 'NewShoppingCartInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) shoppingCart: Omit<ShoppingCart, 'id'>,
  ): Promise<ShoppingCart | void> {
    // return this.userRepository.shoppingCarts(id).create(shoppingCart);
    return this.shoppingCartRepository.addItem(shoppingCart, id);
  }

  @patch('/users/{id}/shopping-carts', {
    responses: {
      '200': {
        description: 'User.ShoppingCart PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ShoppingCart, {partial: true}),
        },
      },
    })
    shoppingCart: Partial<ShoppingCart>,
    @param.query.object('where', getWhereSchemaFor(ShoppingCart)) where?: Where<ShoppingCart>,
  ): Promise<Count> {
    return this.userRepository.shoppingCarts(id).patch(shoppingCart, where);
  }

  @del('/users/{id}/shopping-carts', {
    responses: {
      '200': {
        description: 'User.ShoppingCart DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ShoppingCart)) where?: Where<ShoppingCart>,
  ): Promise<Count> {
    return this.userRepository.shoppingCarts(id).delete(where);
  }
}
