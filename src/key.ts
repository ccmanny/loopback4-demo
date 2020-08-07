import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'dctest';
  export const TOKEN_EXPIRE_IN_VALUE = 1200;
}

export namespace TokneServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRE_IN = BindingKey.create<number>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice');
}
