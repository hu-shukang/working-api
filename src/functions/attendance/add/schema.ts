export const bodySchema = {
  type: 'object',
  required: ['date', 'start', 'end'],
  properties: {
    date: {
      type: 'string',
      format: 'date'
    },
    start: {
      type: 'string',
      format: 'HH:mm'
    },
    end: {
      type: 'string',
      format: 'HH:mm',
      isAfter: 'start'
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
