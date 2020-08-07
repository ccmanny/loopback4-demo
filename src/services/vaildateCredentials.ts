import {HttpErrors} from '@loopback/rest'
import {Credentials} from '../repositories/user.repository'


export function vaildateCredentials(credentials: Credentials): void {
  if (credentials.password.length <= 5) {
    throw new HttpErrors.UnprocessableEntity('password must >= 5 characters')
  }
}
