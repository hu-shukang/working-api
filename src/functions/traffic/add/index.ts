import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/traffic',
        cors: true,
        authorizer: Const.AUTHORIZER
      }
    }
  ]
};
