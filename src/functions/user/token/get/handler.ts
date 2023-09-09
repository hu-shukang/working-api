import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { schema, bodySchema } from './schema';
import { OAuth2Client } from 'google-auth-library';
import { ParameterLib } from '@libs/parameter.lib';
import { DynamoDBLib } from '@libs/dynamodb.lib';
import { Key } from '@models/common.model';
import { Const } from '@libs/const.lib';
import { OAuth2Lib } from '@libs/oauth2.lib';
import { EmployeeInfoEntity, employeeInfoEntityToViewModel } from '@models/user.model';

const token: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const { provider, code } = event.body;
  console.log(provider, code);
  const parameterLib = new ParameterLib();
  const names = ['/working-api/google-client-id', '/working-api/google-client-secret'];
  const [clientIdParam, clientSecretParam] = await parameterLib.getParameters(names);

  const oauth2Lib = new OAuth2Lib(clientIdParam.Value, clientSecretParam.Value);
  const tokens = await oauth2Lib.getToken(code);
  const payload = await oauth2Lib.getPayload(tokens.id_token);

  const dynamodbLib = new DynamoDBLib();
  const key: Key = {
    pkName: 'sub',
    pkValue: payload.sub
  };
  const record = await dynamodbLib.getRecord<EmployeeInfoEntity>(process.env.WORKING_TBL, Const.SUB_IDX, key);
  const employeeInfoViewModel = employeeInfoEntityToViewModel(record);

  return formatJSONResponse({
    accessToken: tokens.access_token,
    idToken: tokens.id_token,
    refreshToken: tokens.refresh_token,
    tokenType: tokens.token_type,
    expiryDate: tokens.expiry_date,
    scope: tokens.scope,
    info: employeeInfoViewModel
  });
};

export const main = middyfy(token, schema);
