import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ShoppingCart, ShoppingCartRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class ShoppingCartRepository extends DefaultCrudRepository<
  ShoppingCart,
  typeof ShoppingCart.prototype.id,
  ShoppingCartRelations
  > {

  public readonly user: BelongsToAccessor<User, typeof ShoppingCart.prototype.id>;

  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ShoppingCart, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
  async addItem(shoppingCart: ShoppingCart, userId: string) {
    //查询是否有对应购物车内有相同产品
    let userProduct = await this.findOne({where: {userId: userId, productId: shoppingCart.productId}});
    let inCart = true;
    if (userProduct == null) {
      inCart = false;
      shoppingCart.userId = userId;
      shoppingCart.quantity = 1;
      return this.create(shoppingCart);

    }
    shoppingCart.quantity = userProduct.quantity + 1;
    return this.updateById(userProduct.id, shoppingCart)


  }
}
