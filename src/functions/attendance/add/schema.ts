const trafficSchema = {
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
  type: 'object',
  required: ['date'],
  properties: {
    date: {
      type: 'string',
      format: 'date'
    },
    start: {
      type: 'string',
      format: 'HH:mm',
      nullable: true
    },
    end: {
      type: 'string',
      format: 'HH:mm',
      isAfter: 'start',
      nullable: true
    },
    break: {
      type: 'integer',
      minimum: 0,
      nullable: true
    },
    nightBreak: {
      type: 'integer',
      minimum: 0,
      nullable: true
    },
    timeOff: {
      type: 'string',
      nullable: true
    },
    remotely: {
      type: 'boolean',
      nullable: true
    },
    comment: {
      type: 'string',
      maxLength: 100,
      nullable: true
    },
    trafficList: {
      type: 'array',
      uniqueItems: true,
      maxItems: 10,
      nullable: true,
      items: trafficSchema
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
