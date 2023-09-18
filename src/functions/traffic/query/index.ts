import { handlerPath } from '@utils/lambda.util';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/traffic',
        cors: true
      }
    }
  ]
};
