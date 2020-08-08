import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {Shop} from '../models';
import {ShopRepository} from '../repositories';

export class ShopController {
  constructor(
    @repository(ShopRepository)
    public shopRepository: ShopRepository,
  ) {}



  @get('/shops/count', {
    responses: {
      '200': {
        description: 'Shop model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Shop) where?: Where<Shop>,
  ): Promise<Count> {
    return this.shopRepository.count(where);
  }

  @get('/shops', {
    responses: {
      '200': {
        description: 'Array of Shop model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Shop, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Shop) filter?: Filter<Shop>,
  ): Promise<Shop[]> {
    return this.shopRepository.find(filter);
  }


  @get('/shops/{id}', {
    responses: {
      '200': {
        description: 'Shop model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Shop, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Shop, {exclude: 'where'}) filter?: FilterExcludingWhere<Shop>
  ): Promise<Shop> {
    return this.shopRepository.findById(id, filter);
  }


}
