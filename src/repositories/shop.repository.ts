import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Shop, ShopRelations, Product} from '../models';
import {MongoDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from './product.repository';

export class ShopRepository extends DefaultCrudRepository<
  Shop,
  typeof Shop.prototype.id,
  ShopRelations
> {

  public readonly products: HasManyRepositoryFactory<Product, typeof Shop.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Shop, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
