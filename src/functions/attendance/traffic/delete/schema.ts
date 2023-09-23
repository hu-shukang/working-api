export const pathParametersSchema = {
  type: 'object',
  required: ['date', 'index'],
  properties: {
    date: {
      type: 'string',
      format: 'date'
    },
    index: {
      type: 'integer',
      minimum: 0
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
