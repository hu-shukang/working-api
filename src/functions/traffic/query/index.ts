import { Const, handlerPath } from '@utils';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/traffic',
        cors: true,
        authorizer: {
          name: Const.AUTHORIZER
        }
      }
    }
  ]
};
