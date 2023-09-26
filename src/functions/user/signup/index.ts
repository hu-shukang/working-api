import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/user/signup',
        authorizer: Const.COMMON_AUTHORIZER
      }
    }
  ]
};
