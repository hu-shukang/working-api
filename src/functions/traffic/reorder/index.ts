import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'patch',
        path: '/traffic/reorder',
        authorizer: Const.SIGNUP_STATUS_AUTHORIZER
      }
    }
  ]
};
