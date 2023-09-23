export const pathParametersSchema = {
  type: 'object',
  required: ['date'],
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
  required: ['pathParameters'],
  properties: {
    pathParameters: pathParametersSchema
  }
} as const;
