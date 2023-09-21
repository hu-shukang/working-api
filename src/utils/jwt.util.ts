import jwt from 'jsonwebtoken';
import { dateUtil } from './date.util';

export class JwtUtil {
  public signAccessToken(payload: any, secret: string) {
    return jwt.sign(payload, secret, { expiresIn: '3h' });
  }

  public verifyAccessToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

  public getRefreshToken(secret: string) {
    const expires = dateUtil.add(null, 30, 'day').unix();
    const payload = { expiresIn: expires };
    return jwt.sign(payload, secret, { expiresIn: '30d' });
  }
}
