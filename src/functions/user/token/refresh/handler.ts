import { middyfy, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/lambda';
import { schema, bodySchema } from './schema';
import { ParameterLib } from '@libs/parameter.lib';
import { OAuth2Lib } from '@libs/oauth2.lib';

const refresh: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const { refreshToken } = event.body;
  const idToken = event.headers.Authorization;
  const parameterLib = new ParameterLib();
  const { clientId, clientSecret } = await parameterLib.getGoogleClientParameter();

  const oauth2Lib = new OAuth2Lib(clientId, clientSecret);
  const tokens = await oauth2Lib.refreshTokens(idToken, refreshToken);

  return formatJSONResponse({
    ...tokens
  });
};

export const main = middyfy(refresh, schema);
