import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/user/signup',
        cors: true,
        authorizer: {
          name: Const.COMMON_AUTHORIZER
        }
      }
    }
  ]
};
