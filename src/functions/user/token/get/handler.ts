import {
  middyfy,
  ValidatedEventAPIGatewayProxyEvent,
  ParameterUtil,
  DynamoDBUtil,
  Const,
  OAuth2Util,
  dateUtil
} from '@utils';
import { schema, bodySchema } from './schema';
import { Key, EmployeeInfoEntity, employeeInfoEntityToViewModel, EmployeeDeletedError } from '@models';
import { TokenPayload } from 'google-auth-library';

/**
 * 社員情報を仮登録する
 *
 * @param dynamodbUtil DynamoDBUtil
 * @param payload TokenPayload
 * @returns 仮の社員ID
 */
const addEmployeeInfo = async (dynamodbUtil: DynamoDBUtil, payload: TokenPayload): Promise<EmployeeInfoEntity> => {
  const key = {
    pk: payload.sub,
    sk: Const.INFO
  };
  const attributes = {
    type: Const.EMPLOYEE_INFO,
    createDate: dateUtil.unix(),
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
  await dynamodbUtil.addRecord(process.env.WORKING_TBL, key, attributes);
  return {
    ...key,
    ...attributes
  } as EmployeeInfoEntity;
};

const getToken: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const { provider, code } = event.body;
  console.log(provider, code);
  const parameterUtil = new ParameterUtil();
  const { googleClientId, googleClientSecret, jwtSecret } = await parameterUtil.getOAuth2Parameters();

  const oauth2Util = new OAuth2Util(googleClientId, googleClientSecret);
  const tokens = await oauth2Util.getToken(code);
  const payload = await oauth2Util.getPayload(tokens.idToken);
  console.log(payload);
  const dynamodbUtil = new DynamoDBUtil();
  const key: Key = {
    pkName: 'sub',
    pkValue: payload.sub
  };
  let record = await dynamodbUtil.getRecord<EmployeeInfoEntity>(process.env.WORKING_TBL, Const.SUB_IDX, key);
  if (record === undefined) {
    record = await addEmployeeInfo(dynamodbUtil, payload);
    console.log('仮登録社員情報：');
    console.log(record);
  }
  if (record.deleted) {
    throw new EmployeeDeletedError();
  }
  const employeeInfoViewModel = employeeInfoEntityToViewModel(record);
  const newPayload = {
    id: employeeInfoViewModel.id,
    signupStatus: employeeInfoViewModel.signupStatus,
    role: employeeInfoViewModel.role
  };
  const accessToken = oauth2Util.signAccessToken(newPayload, jwtSecret);
  const refreshToken = oauth2Util.getRefreshToken(jwtSecret);
  return {
    tokens: {
      accessToken,
      refreshToken
    },
    info: employeeInfoViewModel
  };
};

export const main = middyfy(getToken, schema);
