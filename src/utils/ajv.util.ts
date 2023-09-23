import Ajv, { KeywordDefinition } from 'ajv';
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

export const getAjv = (schema?: object): any => {
  let ajv = new Ajv({ $data: true, allErrors: true, coerceTypes: false });
  ajv = addKeyWorkds(ajv);
  ajv = addFormats(ajv);
  ajv.addKeyword(uniqueIndex);
  return ajv.compile(schema);
};
