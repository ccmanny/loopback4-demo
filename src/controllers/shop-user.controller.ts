import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Shop,
  User,
} from '../models';
import {ShopRepository} from '../repositories';

export class ShopUserController {
  constructor(
    @repository(ShopRepository)
    public shopRepository: ShopRepository,
  ) { }

  @get('/shops/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Shop',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Shop.prototype.id,
  ): Promise<User> {
    return this.shopRepository.user(id);
  }
}
