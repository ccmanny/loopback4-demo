import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {TestInterceptorInterceptor} from './interceptors/test-interceptor.interceptor';
import {
  errorLogServiceBindings,
  InterceptorseBindings, PasswordHasherBindings, TokenServiceConstants,
  TokneServiceBindings
} from './key';
import {MySequence} from './sequence';
import {ErrorLogService} from './services/errorLogService';
import {BcryptHasher} from './services/hash.password.bcryptjs';
import {JWTService} from './services/jwt-service';
export {ApplicationConfig};

export class MeituanApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    // this.add(createBindingFromClass(TestInterceptorInterceptor, {key: TestInterceptorInterceptor.name}));
    this.add(createBindingFromClass(TestInterceptorInterceptor, {key: InterceptorseBindings.ERRORLOG_INTERCEPTOR}));
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    this.component(AuthorizationComponent);
    this.setBindings();
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setBindings(): void {

    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(TokneServiceBindings.TOKEN_EXPIRE_IN).to(TokenServiceConstants.TOKEN_EXPIRE_IN_VALUE);
    this.bind(TokneServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    this.bind(TokneServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    this.bind(errorLogServiceBindings.ERRORLOG_SERVICE).toClass(ErrorLogService);

    // this.add(InterceptorseBindings.ERRORLOG_INTERCEPTOR).toClass(TestInterceptorInterceptor);
  }
}
