import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Order, ShoppingCart, User, UserRelations} from '../models';
import {OrderRepository} from './order.repository';
import {ShoppingCartRepository} from './shopping-cart.repository';

export interface Credentials {
  account: string,
  password: string
}

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
