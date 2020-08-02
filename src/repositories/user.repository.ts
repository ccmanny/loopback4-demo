import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Order, ShoppingCart} from '../models';
import {MongoDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {OrderRepository} from './order.repository';
import {ShoppingCartRepository} from './shopping-cart.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly orders: HasManyRepositoryFactory<Order, typeof User.prototype.id>;

  public readonly shoppingCarts: HasManyRepositoryFactory<ShoppingCart, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource, @repository.getter('OrderRepository') protected orderRepositoryGetter: Getter<OrderRepository>, @repository.getter('ShoppingCartRepository') protected shoppingCartRepositoryGetter: Getter<ShoppingCartRepository>,
  ) {
    super(User, dataSource);
    this.shoppingCarts = this.createHasManyRepositoryFactoryFor('shoppingCarts', shoppingCartRepositoryGetter,);
    this.registerInclusionResolver('shoppingCarts', this.shoppingCarts.inclusionResolver);
    this.orders = this.createHasManyRepositoryFactoryFor('orders', orderRepositoryGetter,);
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
  }
}
