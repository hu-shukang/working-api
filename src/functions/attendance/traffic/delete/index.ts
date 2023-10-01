import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/attendance/{date}/traffic/{index}',
        authorizer: Const.SIGNUP_STATUS_AUTHORIZER
      }
    }
  ]
};