import { handlerPath } from '@libs/lambda';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  layers: [{ Ref: 'CommonLambdaLayer' }],
  events: [
    {
      http: {
        method: 'post',
        path: '/user/token',
        cors: true
      }
    }
  ]
};
