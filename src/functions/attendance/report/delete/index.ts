import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/attendance/{date}/report',
        authorizer: Const.SIGNUP_STATUS_AUTHORIZER
      }
    }
  ]
};
