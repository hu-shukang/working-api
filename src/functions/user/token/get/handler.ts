import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { schema, bodySchema } from './schema';
import { ParameterLib } from '@libs/parameter.lib';
import { DynamoDBLib } from '@libs/dynamodb.lib';
import { Key } from '@models/common.model';
import { Const } from '@libs/const.lib';
import { OAuth2Lib } from '@libs/oauth2.lib';
import { EmployeeInfoEntity, employeeInfoEntityToViewModel } from '@models/user.model';
import { EmployeeDeletedError } from '@models/error.model';
import { TokenPayload } from 'google-auth-library';
import { stringLib } from '@libs/string.lib';
import { dateLib } from '@libs/date.lib';

/**
 * 社員情報を仮登録する
 *
 * @param dynamodbLib DynamoDBLib
 * @param payload TokenPayload
 * @returns 仮の社員ID
 */
const addEmployeeInfo = async (dynamodbLib: DynamoDBLib, payload: TokenPayload): Promise<EmployeeInfoEntity> => {
  const tempEmployeeId = stringLib.uuid();
  const key = {
    pk: tempEmployeeId,
    sk: Const.INFO
  };
  const attributes = {
    type: Const.EMPLOYEE_INFO,
    createDate: dateLib.unix(),
    createUser: 'INIT',
    deleted: false,
    email: payload.email,
    familyName: payload.family_name,
    givenName: payload.given_name,
    picture: payload.picture,
    role: Const.ROLE_EMPLOYEE,
    sub: payload.sub,
    signupStatus: Const.PENDING
  };
  await dynamodbLib.addRecord(process.env.WORKING_TBL, key, attributes);
  return {
    ...key,
    ...attributes
  } as EmployeeInfoEntity;
};

const getToken: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const { provider, code } = event.body;
  console.log(provider, code);
  const parameterLib = new ParameterLib();
  const { clientId, clientSecret } = await parameterLib.getGoogleClientParameter();

  const oauth2Lib = new OAuth2Lib(clientId, clientSecret);
  const tokens = await oauth2Lib.getToken(code);
  const payload = await oauth2Lib.getPayload(tokens.idToken);
  console.log(payload);
  const dynamodbLib = new DynamoDBLib();
  const key: Key = {
    pkName: 'sub',
    pkValue: payload.sub
  };
  let record = await dynamodbLib.getRecord<EmployeeInfoEntity>(process.env.WORKING_TBL, Const.SUB_IDX, key);
  if (record === undefined) {
    record = await addEmployeeInfo(dynamodbLib, payload);
    console.log('仮登録社員情報：');
    console.log(record);
  }
  if (record.deleted) {
    throw new EmployeeDeletedError();
  }
  const employeeInfoViewModel = employeeInfoEntityToViewModel(record);

  return formatJSONResponse({
    tokens: tokens,
    info: employeeInfoViewModel
  });
};

export const main = middyfy(getToken, schema);
