import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  getWhereSchemaFor,




  HttpErrors, param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {Shop, User} from '../models';
import {ShopRepository, UserRepository} from '../repositories';
import {basicAuthorization} from '../services/basic.authorizor';

export class UserShopController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(ShopRepository) protected shopRepository: ShopRepository,
  ) {}

  @authenticate('jwt')
  @authorize({allowedRoles: ['shop'], voters: [basicAuthorization]})
  @get('/users/{id}/shop', {
    responses: {
      '200': {
        description: 'User has one Shop',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Shop),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Shop>,
  ): Promise<Shop> {
    return this.userRepository.shop(id).get(filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['shop'], voters: [basicAuthorization]})
  @post('/users/{id}/shop', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Shop)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shop, {
            title: 'NewShopInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) shop: Omit<Shop, 'id'>,
  ): Promise<Shop> {
    let res = await this.shopRepository.findOne({where: {userId: id}})
    if (res)
      throw new HttpErrors.Unauthorized('error : shop exsit ');
    return this.userRepository.shop(id).create(shop);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['shop'], voters: [basicAuthorization]})
  @patch('/users/{id}/shop', {
    responses: {
      '200': {
        description: 'User.Shop PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shop, {partial: true}),
        },
      },
    })
    shop: Partial<Shop>,
    @param.query.object('where', getWhereSchemaFor(Shop)) where?: Where<Shop>,
  ): Promise<Count> {
    return this.userRepository.shop(id).patch(shop, where);
  }


}
