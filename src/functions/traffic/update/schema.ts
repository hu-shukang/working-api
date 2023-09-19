export const bodySchema = {
  type: 'object',
  required: ['startStation', 'endStation', 'roundTrip'],
  properties: {
    startStation: {
      type: 'string',
      maxLength: 20
    },
    endStation: {
      type: 'string',
      maxLength: 20
    },
    tractStation: {
      type: 'array',
      nullable: true,
      uniqueItems: true,
      items: {
        type: 'string',
        maxLength: 20
      }
    },
    roundTrip: {
      type: 'integer',
      minimum: 0
    },
    monthTrainPass: {
      type: 'integer',
      minimum: 0,
      nullable: true
    },
    comment: {
      type: 'string',
      nullable: true,
      maxLength: 100
    }
  },
  additionalProperties: false
} as const;

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
  required: ['body', 'pathParameters'],
  properties: {
    body: bodySchema,
    pathParameters: pathParametersSchema
  }
} as const;
