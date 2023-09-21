import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'put',
        path: '/traffic/{routeId}',
        cors: true,
        authorizer: {
          name: Const.AUTHORIZER
        }
      }
    }
  ]
};
