import middy from '@middy/core';
import { normalizeHttpResponse } from '@middy/util';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { HttpError } from '@models/error.model';
import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import { BusinessErrorCodeMessages, BusinessErrorCodes } from './const.util';
import { getAjv } from './ajv.util';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, any>;

export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

const responseParser = (): middy.MiddlewareObj => {
  return {
    after: async (request) => {
      console.log(request.response);
      if (request.response === undefined) return;
      request.response = {
        statusCode: 200,
        body: JSON.stringify(request.response),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }
  };
};

const customErrorHandler = (): middy.MiddlewareObj => {
  return {
    onError: async (request) => {
      if (request.response !== undefined) return;
      let statusCode = 500;
      let businessErrorCode = undefined;
      console.log(request.error);
      console.log(request.error.name);
      if (request.error.name === 'HttpError') {
        const error = request.error as HttpError;
        statusCode = error.statusCode;
        businessErrorCode = error.businessErrorCode;
      } else if (request.error.name === 'BadRequestError') {
        console.debug(request.error);
        statusCode = (request.error as any).statusCode;
        businessErrorCode = BusinessErrorCodes.S00;
        request.error.message = BusinessErrorCodeMessages.S00;
      }
      const message = request.error.message || 'Internal server error';
      normalizeHttpResponse(request);
      request.response = {
        ...request.response,
        statusCode,
        body: JSON.stringify({ error: message, businessErrorCode: businessErrorCode ?? BusinessErrorCodes.S99 }),
        headers: {
          ...request.response.headers
        }
      };
    }
  };
};

export const middyfy = (handler: any, schema?: object) => {
  let func = middy(handler).use(customErrorHandler()).use(middyJsonBodyParser()).use(responseParser());
  if (schema) {
    const ajv = getAjv(schema);
    func = func.use(validator({ eventSchema: ajv }));
  }
  return func;
};
