export const queryStringParametersSchema = {
  type: 'object',
  properties: {
    routeId: {
      type: 'string',
      format: 'uuid'
    }
  },
  additionalProperties: false
} as const;

export const schema = {
  type: 'object',
  required: ['queryStringParameters'],
  properties: {
    queryStringParameters: queryStringParametersSchema
  }
} as const;
