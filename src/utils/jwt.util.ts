import jwt from 'jsonwebtoken';
import { dateUtil } from './date.util';

export class JwtUtil {
  public signAccessToken(payload: any, secret: string) {
    return jwt.sign(payload, secret, { expiresIn: '3h' });
  }

  public verifyToken(token: string, secret: string): any {
    token = token.replace('Bearer ', '');
    return jwt.verify(token, secret);
  }

  public getRefreshToken(secret: string) {
    const expires = dateUtil.add(undefined, 30, 'day').toISOString();
    const payload = { expiresIn: expires };
    console.log(payload);
    return jwt.sign(payload, secret, { expiresIn: '30d' });
  }
}
