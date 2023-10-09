const itemSchema = {
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
    comment: {
      type: 'string',
      nullable: true,
      maxLength: 100
    }
  },
  additionalProperties: false
} as const;

export const bodySchema = {
  type: 'array',
  uniqueItems: true,
  minItems: 1,
  maxItems: 50,
  items: itemSchema
} as const;

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
  required: ['body', 'pathParameters'],
  properties: {
    body: bodySchema,
    pathParameters: pathParametersSchema
  }
} as const;
