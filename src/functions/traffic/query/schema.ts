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
  properties: {
    queryStringParameters: queryStringParametersSchema
  }
} as const;
