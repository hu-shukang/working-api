export const queryStringParametersSchema = {
  type: ['object', 'null'],
  properties: {
    date: {
      type: 'string',
      format: 'date'
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
