import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { schema, bodySchema } from './schema';
import { CognitoLib } from '@libs/cognito.lib';

const login: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const { provider, code } = event.body;
  const cognitoLib = new CognitoLib();
  const result = await cognitoLib.initiateAuth(provider, code);

  return formatJSONResponse({
    result: result.AuthenticationResult
  });
};

export const main = middyfy(login, schema);
