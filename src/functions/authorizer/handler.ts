import { JwtUtil, OAuth2Util, ParameterUtil } from '@utils';
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
    const secret = await parameterUtil.getJwtSecret();
    const jwtUtil = new JwtUtil();
    const payload = jwtUtil.verifyAccessToken(token, secret);
    console.log(payload);
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
