import { JwtUtil, ParameterUtil } from '@utils';
import { CustomAuthorizerResult, Context, Callback, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';

const generatePolicy = (
  event: APIGatewayRequestAuthorizerEvent,
  effect: string,
  payload: any
): CustomAuthorizerResult => {
  return {
    principalId: event.headers.Authorization,
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

export const main = async (event: APIGatewayRequestAuthorizerEvent, _context: Context, callback: Callback) => {
  try {
    const token = event.headers.Authorization;
    console.log('token', token);
    const parameterUtil = new ParameterUtil();
    const secret = await parameterUtil.getJwtSecret();
    const jwtUtil = new JwtUtil();
    const payload = jwtUtil.verifyToken(token, secret);
    console.log('payload', payload);
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
