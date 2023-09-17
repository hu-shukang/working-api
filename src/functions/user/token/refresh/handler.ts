import { middyfy, ValidatedEventAPIGatewayProxyEvent, formatJSONResponse, ParameterUtil, OAuth2Util } from '@utils';
import { schema, bodySchema } from './schema';

const refresh: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const { refreshToken } = event.body;
  const idToken = event.headers.Authorization;
  const parameterUtil = new ParameterUtil();
  const { clientId, clientSecret } = await parameterUtil.getGoogleClientParameter();

  const oauth2Util = new OAuth2Util(clientId, clientSecret);
  const tokens = await oauth2Util.refreshTokens(idToken, refreshToken);

  return formatJSONResponse({
    ...tokens
  });
};

export const main = middyfy(refresh, schema);
