export const item = {
  type: 'object',
  required: ['routeId', 'index'],
  properties: {
    routeId: {
      type: 'string',
      format: 'uuid'
    },
    index: {
      type: 'integer',
      minimum: 0
    }
  },
  additionalProperties: false
} as const;

export const bodySchema = {
  type: 'array',
  items: item,
  minItems: 1,
  uniqueFields: ['routeId', 'index']
} as const;

export const schema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: bodySchema
  }
} as const;
