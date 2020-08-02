import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Shop,
  Product,
} from '../models';
import {ShopRepository} from '../repositories';

export class ShopProductController {
  constructor(
    @repository(ShopRepository) protected shopRepository: ShopRepository,
  ) { }

  @get('/shops/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Shop has many Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.shopRepository.products(id).find(filter);
  }

  @post('/shops/{id}/products', {
    responses: {
      '200': {
        description: 'Shop model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Shop.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInShop',
            exclude: ['id'],
            optional: ['shopId']
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.shopRepository.products(id).create(product);
  }

  @patch('/shops/{id}/products', {
    responses: {
      '200': {
        description: 'Shop.Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.shopRepository.products(id).patch(product, where);
  }

  @del('/shops/{id}/products', {
    responses: {
      '200': {
        description: 'Shop.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.shopRepository.products(id).delete(where);
  }
}
