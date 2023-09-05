export const bodySchema = {
  type: 'object',
  required: ['provider', 'code'],
  properties: {
    provider: {
      type: 'string',
      enum: ['google']
    },
    code: {
      type: 'string'
    }
  },
  additionalProperties: false
} as const;

export const schema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: bodySchema
  }
} as const;
