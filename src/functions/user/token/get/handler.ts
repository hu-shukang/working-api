import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { schema, bodySchema } from './schema';
import { OAuth2Client } from 'google-auth-library';
import { ParameterLib } from '@libs/parameter.lib';

const token: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const { provider, code } = event.body;
  console.log(provider, code);
  const parameterLib = new ParameterLib();
  const names = ['/working-api/google-client-id', '/working-api/google-client-secret'];
  const [clientIdParam, clientSecretParam] = await parameterLib.getParameters(names);
  const client = new OAuth2Client(clientIdParam.Value, clientSecretParam.Value, 'http://localhost:3000');
  const token = await client.getToken(code);

  return formatJSONResponse({
    ...token.tokens
  });
};

export const main = middyfy(token, schema);
