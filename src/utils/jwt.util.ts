import jwt from 'jsonwebtoken';
import { dateUtil } from './date.util';
import { Const } from './const.util';

export class JwtUtil {
  public signAccessToken(payload: any, secret: string) {
    return jwt.sign(payload, secret, { expiresIn: '3h' });
  }

  public verifyAccessToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

  public getRefreshToken(secret: string) {
    const expires = dateUtil.add(undefined, 30, 'day').format(Const.FORMAT_YYYY_MM_DD_HH_mm_ss);
    const payload = { expiresIn: expires };
    console.log(payload);
    return jwt.sign(payload, secret, { expiresIn: '30d' });
  }
}