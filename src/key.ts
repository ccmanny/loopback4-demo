import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {ErrorLogService} from './services/errorLogService';
import {PasswordHasher} from './services/hash.password.bcryptjs';
export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'dctest';
  export const TOKEN_EXPIRE_IN_VALUE = 12000;
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

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace errorLogServiceBindings {
  export const ERRORLOG_SERVICE = BindingKey.create<ErrorLogService>(
    'services.errorlogservice');
}

export namespace InterceptorseBindings {
  export const ERRORLOG_INTERCEPTOR = 'Interceptors.errorloginterceptor';
}
