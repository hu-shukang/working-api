export const pathParametersSchema = {
  type: 'object',
  required: ['routeId'],
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
  required: ['pathParameters'],
  properties: {
    pathParameters: pathParametersSchema
  }
} as const;
