import { OAuth2Lib } from '@libs/oauth2.lib';
import { ParameterLib } from '@libs/parameter.lib';
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
    const parameterLib = new ParameterLib();
    const { clientId, clientSecret } = await parameterLib.getGoogleClientParameter();
    const oauth2Lib = new OAuth2Lib(clientId, clientSecret);
    const payload = await oauth2Lib.getPayload(token);
    if (payload) {
      const policy = generatePolicy(event, 'Allow', payload);
      callback(null, policy);
    }
    const policy = generatePolicy(event, 'Deny', {});
    callback(null, policy);
  } catch (err) {
    const policy = generatePolicy(event, 'Deny', {});
    callback(null, policy);
  }
};
