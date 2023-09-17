import middy from '@middy/core';
import { normalizeHttpResponse } from '@middy/util';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import cors from '@middy/http-cors';
import { HttpError } from '@models/error.model';
import type { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, any>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};

export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

const responseParser = (): middy.MiddlewareObj => {
  return {
    after: async (request) => {
      if (request.response !== undefined) return;
      request.response = {
        statusCode: 200,
        body: JSON.stringify(request.response),
        headers: {
          'Content-Type': 'application/json'
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
      if (request.error.name === 'HttpError') {
        const error = request.error as HttpError;
        statusCode = error.statusCode;
        businessErrorCode = error.businessErrorCode;
      }
      const message = request.error.message || 'Internal server error';
      normalizeHttpResponse(request);
      request.response = {
        ...request.response,
        statusCode,
        body: JSON.stringify({ error: message, businessErrorCode: businessErrorCode }),
        headers: {
          ...request.response.headers
        }
      };
    }
  };
};

export const middyfy = (handler: any, schema?: object) => {
  let func = middy(handler).use(middyJsonBodyParser()).use(responseParser());
  if (schema) {
    const ajv = transpileSchema(schema, { $data: true, allErrors: true, coerceTypes: false });
    func = func.use(validator({ eventSchema: ajv }));
  }
  func = func.use(cors()).use(customErrorHandler());
  return func;
};
