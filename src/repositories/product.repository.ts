import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Product, ProductRelations, Shop, ShoppingCart} from '../models';
import {ShopRepository} from './shop.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
  > {

  public readonly shoppingCart: HasOneRepositoryFactory<ShoppingCart, typeof Product.prototype.id>;

  public readonly shop: BelongsToAccessor<Shop, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
    @repository.getter('ShopRepository') protected shopRepositoryGetter: Getter<ShopRepository>,
  ) {
    super(Product, dataSource);
    this.shop = this.createBelongsToAccessorFor('shop', shopRepositoryGetter,);
    this.registerInclusionResolver('shop', this.shop.inclusionResolver);

  }
}
