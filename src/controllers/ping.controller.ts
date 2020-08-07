import {authenticate, TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject, intercept} from '@loopback/core';
import {get, Request, ResponseObject, RestBindings} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {TestInterceptorInterceptor} from '../interceptors/test-interceptor.interceptor';
import {basicAuthorization} from '../services/basic.authorizor';
/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
@intercept(TestInterceptorInterceptor.name)
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(TokenServiceBindings.TOKEN_SERVICE) private jwtService: TokenService
  ) {}

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  // @authenticate('jwt')
  // @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async ping(): Promise<any> {
    console.log('--pingController--')
    let userInfo: UserProfile;
    userInfo = {
      [securityId]: '1',
      email: "dc@qq.com",
      name: "dc",
      roles: ["customer"],
    };
    let token = await this.jwtService.generateToken(userInfo);
    // let user = await this.jwtService.verifyToken(token);
    return token;
    // Reply with a greeting, the current time, the url, and request headers

    // return {
    //   greeting: 'Hello from LoopBack',
    //   date: new Date(),
    //   url: this.req.url,
    //   headers: Object.assign({}, this.req.headers),
    // };
  }
  @get('/test')
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  test(): string {
    return 'ok';
  }
}
