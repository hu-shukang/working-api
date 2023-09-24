import Ajv, { Format, KeywordDefinition } from 'ajv';
import addKeyWorkds from 'ajv-keywords';
import addFormats from 'ajv-formats';

const uniqueIndex: KeywordDefinition = {
  keyword: 'uniqueFields',
  type: 'array',
  schemaType: 'array',
  validate: function (schema: string[], data: any) {
    for (const field of schema) {
      const seen = new Set<any>();
      for (const item of data) {
        const index = item[field];
        if (index === undefined) {
          return false;
        }
        if (seen.has(index)) {
          return false;
        }
        seen.add(index);
      }
    }
    return true;
  }
};

const isAfter: KeywordDefinition = {
  keyword: 'isAfter',
  type: 'string',
  errors: false,
  schemaType: 'string',
  compile: (sch, _parentSchema) => {
    return (data, dataCtx) => {
      const dependentField = sch;
      const dependentValue = dataCtx.parentData[dependentField];
      console.log('sch', sch);
      console.log('dependentValue', dependentValue);
      if (!dependentValue) {
        return true;
      }
      const start = new Date(`1970-01-01T${dependentValue}Z`);
      const end = new Date(`1970-01-01T${data}Z`);
      return end > start;
    };
  }
};

const hhmmFormat: Format = {
  type: 'string',
  validate: (data) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(data);
  }
};

const yymmFormat: Format = {
  type: 'string',
  validate: (data) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
    return regex.test(data);
  }
};

const unixTimeMilliseconds: Format = {
  type: 'string',
  validate: (data) => {
    // 验证字符串是否由13个数字组成
    const regex = /^\d{13}$/;
    return regex.test(data);
  }
};

export const getAjv = (schema?: object): any => {
  let ajv = new Ajv({ $data: true, allErrors: true, coerceTypes: false });
  ajv = addKeyWorkds(ajv);
  ajv = addFormats(ajv);
  ajv.addKeyword(uniqueIndex);
  ajv.addKeyword(isAfter);
  ajv.addFormat('HH:mm', hhmmFormat);
  ajv.addFormat('YYYY-MM', yymmFormat);
  ajv.addFormat('unix-time-milliseconds', unixTimeMilliseconds);
  return ajv.compile(schema);
};
