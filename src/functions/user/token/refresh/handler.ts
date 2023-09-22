import { middyfy, ValidatedEventAPIGatewayProxyEvent, ParameterUtil, JwtUtil } from '@utils';
import { schema, bodySchema } from './schema';

const refresh: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const { refreshToken } = event.body;
  const token = event.headers.Authorization;
  const parameterUtil = new ParameterUtil();
  const jwtSecret = await parameterUtil.getJwtSecret();
  const jwtUtil = new JwtUtil();
  const payload = jwtUtil.verifyToken(token, jwtSecret);
  console.log('payload', payload);
  const refreshPayload = jwtUtil.verifyToken(refreshToken, jwtSecret);
  console.log('refreshPayload', refreshPayload);
  const newPayload = {
    id: payload.id,
    signupStatus: payload.signupStatus,
    role: payload.role
  };
  const accessToken = jwtUtil.signAccessToken(newPayload, jwtSecret);
  return {
    accessToken
  };
};

export const main = middyfy(refresh, schema);
