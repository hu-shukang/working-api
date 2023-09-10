import { handlerPath } from '@libs/lambda';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`
};
