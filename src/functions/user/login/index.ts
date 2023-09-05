import { handlerPath } from '@libs/lambda';
import { schema } from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: '/user/login',
        request: {
          schemas: {
            'application/json': schema
          }
        }
      }
    }
  ]
};
