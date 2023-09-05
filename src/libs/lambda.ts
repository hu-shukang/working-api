import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import httpErrorHandler from '@middy/http-error-handler';

export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

export const middyfy = (handler: any, schema?: object) => {
  let func = middy(handler).use(middyJsonBodyParser());
  if (schema) {
    const ajv = transpileSchema(schema, { $data: true, allErrors: true, coerceTypes: false });
    func = func.use(validator({ eventSchema: ajv }));
  }
  func = func.use(httpErrorHandler());
  return func;
};
