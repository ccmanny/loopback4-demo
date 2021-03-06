import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);
export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    readonly jwtExpiresIn: string,
    @inject(TokenServiceBindings.TOKEN_SECRET)
    readonly jwtSecret: string,
  ) {}
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('ERROR Token generate. userProfile MISS ');
    }
    const userInfoForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      roles: userProfile.roles,
      shopId: userProfile.shopId,
    }
    let token: string;
    try {
      token = signAsync(userInfoForToken, this.jwtSecret,
        {expiresIn: this.jwtExpiresIn, }
      )


    } catch (err) {
      throw new HttpErrors.Unauthorized(`ERROR Token generate. ${err} `);
    }
    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token)
      throw new HttpErrors.Unauthorized(`not found token `);
    let userProfile: UserProfile;
    let result: any;
    try {
      result = await verifyAsync(token, this.jwtSecret)
    } catch (error) {
      // console.log(error);
      if (error.message == 'jwt expired') {
        throw new HttpErrors.Unauthorized(`ERROR : Token expired `);
      } else {
        throw new HttpErrors.Unauthorized(error);
      }
    }
    userProfile = {
      [securityId]: result.id,
      id: result.id,
      name: result.name,
      roles: result.roles,
      shopId: result.shopId,
    }
    console.log("userProfile: " + JSON.stringify(userProfile));
    return userProfile;

  }

}
