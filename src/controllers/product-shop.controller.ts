import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Product,
  Shop,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductShopController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/shop', {
    responses: {
      '200': {
        description: 'Shop belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Shop)},
          },
        },
      },
    },
  })
  async getShop(
    @param.path.string('id') id: typeof Product.prototype.id,
  ): Promise<Shop> {
    return this.productRepository.shop(id);
  }
}
