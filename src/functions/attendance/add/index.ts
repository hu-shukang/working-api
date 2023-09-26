import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/attendance',
        authorizer: Const.SIGNUP_STATUS_AUTHORIZER
      }
    }
  ]
};
