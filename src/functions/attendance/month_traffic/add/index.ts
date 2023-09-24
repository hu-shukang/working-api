import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/attendance/{date}/month-traffic',
        cors: true,
        authorizer: Const.SIGNUP_STATUS_AUTHORIZER
      }
    }
  ]
};
