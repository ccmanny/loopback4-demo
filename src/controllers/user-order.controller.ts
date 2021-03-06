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
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {Order, User} from '../models';
import {UserRepository} from '../repositories';
import {basicAuthorization} from '../services/basic.authorizor';
import {wsClient} from '../socketioClient/client';
export class UserOrderController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}


  @get('/users/{id}/orders', {
    responses: {
      '200': {
        description: 'Array of User has many Order',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Order)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Order>,
  ): Promise<Order[]> {
    return this.userRepository.orders(id).find(filter);
  }

  // @authenticate('jwt')
  // @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  @post('/users/{id}/orders', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Order)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {
            title: 'NewOrderInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) order: Omit<Order, 'id'>,
  ): Promise<Order> {
    let res = this.userRepository.orders(id).create(order);
    let msgOBJ = {
      room: "001",
      key: "asd",
      msg: "There are new orders"
    }
    // push data by websocket server
    const ws = wsClient.getInstance();
    ws.socket.emit('pushSomeone', JSON.stringify(msgOBJ));
    return res;
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  @patch('/users/{id}/orders', {
    responses: {
      '200': {
        description: 'User.Order PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Partial<Order>,
    @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
  ): Promise<Count> {
    return this.userRepository.orders(id).patch(order, where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  @del('/users/{id}/orders', {
    responses: {
      '200': {
        description: 'User.Order DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
  ): Promise<Count> {
    return this.userRepository.orders(id).delete(where);
  }
}
