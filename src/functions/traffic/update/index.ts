import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'put',
        path: '/traffic/{routeId}',
        authorizer: Const.SIGNUP_STATUS_AUTHORIZER
      }
    }
  ]
};
