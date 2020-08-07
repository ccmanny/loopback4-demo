import {authenticate, TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
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
  getModelSchemaRef,

  HttpErrors, param,


  patch, post,






  requestBody
} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../key';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {Credentials} from '../repositories/user.repository';
import {basicAuthorization} from '../services/basic.authorizor';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {vaildateCredentials} from '../services/vaildateCredentials';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE) private jwtService: TokenService,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    let credentials: Credentials;
    credentials = {
      account: user.account,
      password: user.password
    }
    vaildateCredentials(credentials);
    if (!user.roles) {
      user.roles = ['customer'];
    }
    user.password = await this.passwordHasher.hashPassword(user.password);
    try {
      let res = this.userRepository.create(user);
      delete (await res).password;
      return res;
    } catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueAccount')) {
        throw new HttpErrors.Conflict('account value is exist');
      } else {
        throw error;
      }
    }


  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }


  @authenticate('jwt')
  @authorize({allowedRoles: ['admin', 'customer', 'shop'], voters: [basicAuthorization]})
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin', 'customer', 'shop'], voters: [basicAuthorization]})
  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    delete user.password;
    await this.userRepository.updateById(id, user);
  }


  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<{token: string}> {
    let userInfo: UserProfile;

    let user = await this.userRepository.findOne({
      where: {
        account: credentials.account,
      }
    });
    if (user == null) {
      throw new HttpErrors.Unauthorized('account or password errer ');
    }
    let passwordIsMatched = await this.passwordHasher.comparePassword(credentials.password, user.password);
    if (!passwordIsMatched) {
      throw new HttpErrors.Unauthorized('account or password errer ');
    }
    userInfo = {
      [securityId]: user.id,
      account: user.account,
      name: user.name,
      roles: user.roles,
    };
    console.log("userinfo : " + JSON.stringify(userInfo));
    let token = await this.jwtService.generateToken(userInfo)
    return {token: token};
  }
}
