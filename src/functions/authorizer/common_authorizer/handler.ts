import { OAuth2Util, ParameterUtil } from '@utils';
import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult, Context, Callback } from 'aws-lambda';

const generatePolicy = (
  event: APIGatewayTokenAuthorizerEvent,
  effect: string,
  payload: any
): CustomAuthorizerResult => {
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
      ...payload
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
    let policy: any = undefined;
    if (payload) {
      policy = generatePolicy(event, 'Allow', payload);
    } else {
      policy = generatePolicy(event, 'Deny', {});
    }
    callback(null, policy);
  } catch (err) {
    const policy = generatePolicy(event, 'Deny', {});
    callback(null, policy);
  }
};
