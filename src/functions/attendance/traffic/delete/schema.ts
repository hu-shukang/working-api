export const pathParametersSchema = {
  type: 'object',
  required: ['date', 'index'],
  properties: {
    date: {
      type: 'string',
      format: 'date'
    },
    index: {
      type: 'string',
      format: 'unix-time-milliseconds'
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
