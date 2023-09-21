import { EmployeeInfoEntity } from '@models';
import { Const, DynamoDBUtil, OAuth2Util, ParameterUtil } from '@utils';
import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult, Context, Callback } from 'aws-lambda';

const generatePolicy = (
  event: APIGatewayTokenAuthorizerEvent,
  effect: string,
  payload: any,
  employeeInfo?: EmployeeInfoEntity
): CustomAuthorizerResult => {
  console.log(effect);
  return {
    principalId: '*',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: event.methodArn
        }
      ]
    },
    context: {
      ...payload,
      id: employeeInfo && employeeInfo.pk,
      role: employeeInfo && employeeInfo.role
    }
  };
};

export const main = async (event: APIGatewayTokenAuthorizerEvent, _context: Context, callback: Callback) => {
  try {
    const token = event.authorizationToken;
    const parameterUtil = new ParameterUtil();
    const { clientId, clientSecret } = await parameterUtil.getGoogleClientParameter();
    const oauth2Util = new OAuth2Util(clientId, clientSecret);
    const payload = await oauth2Util.getPayload(token);
    if (payload) {
      const dynamodbUtil = new DynamoDBUtil();
      const employeeInfo = await dynamodbUtil.getRecord<EmployeeInfoEntity>(Const.WORKING_TBL, Const.SUB_IDX, {
        pkName: 'sub',
        pkValue: payload.sub
      });
      let policy: any = {};
      if (employeeInfo === undefined || employeeInfo.deleted || employeeInfo.signupStatus === Const.PENDING) {
        policy = generatePolicy(event, 'Deny', {});
      } else {
        policy = generatePolicy(event, 'Allow', payload, employeeInfo);
      }
      callback(null, policy);
    } else {
      const policy = generatePolicy(event, 'Deny', {});
      callback(null, policy);
    }
  } catch (err) {
    console.log(err);
    const policy = generatePolicy(event, 'Deny', {});
    callback(null, policy);
  }
};
