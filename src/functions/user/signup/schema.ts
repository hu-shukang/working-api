export const bodySchema = {
  type: 'object',
  required: ['id', 'hireDate', 'familyName', 'givenName'],
  properties: {
    id: {
      type: 'string',
      minLength: 6,
      maxLength: 6
    },
    hireDate: {
      type: 'string',
      format: 'date'
    },
    familyName: {
      type: 'string',
      maxLength: 10
    },
    givenName: {
      type: 'string',
      maxLength: 10
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
