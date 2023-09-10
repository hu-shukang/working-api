import { handlerPath } from '@libs/lambda';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/user/token/refresh',
        cors: true,
        authorizer: {
          name: 'tokenAuthorizer'
        }
      }
    }
  ]
};
