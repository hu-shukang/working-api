import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        authorizer: {
          type: "COGNITO_USER_POOLS",
          authorizerId: {
            Ref: "CognitoAuthorizer",
          },
        },
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
