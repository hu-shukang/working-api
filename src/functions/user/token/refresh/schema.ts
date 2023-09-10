export const bodySchema = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
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
