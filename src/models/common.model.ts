export type Key = {
  pkName: string;
  pkValue: any;
  skName?: string;
  skValue?: any;
};

export type RequiredKey = Required<Key>;

export type PK = {
  pkName: string;
  pkValue: any;
};

export type KeyBeginWith = {
  pkName: string;
  pkValue: any;
  skName?: string;
  skValue?: any;
};

export type CommonAttributes = {
  /** パーティションキー */
  pk: string;
  /** ソートキー */
  sk: string;
  /** タイプ */
  type: string;
};

export type DBRecord = CommonAttributes & Record<string, any>;

export type Sort = {
  /** ソート用 */
  sort: string;
};

export type CreateUpdateAttributes = {
  /** 作成日時 */
  createDate?: number;
  /** 作成者 */
  createUser?: string;
  /** 更新日時 */
  updateDate?: number;
  /** 更新者 */
  updateUser?: string;
};

export type DynamoDBQueryOptions = {
  indexName?: string;
  filter?: {
    expression: string;
    expressionAttributeNames?: any;
    expressionAttributeValues: any;
  };
  projectionExpression?: string;
  beginsWithSK?: true;
  exclusiveStartKey?: Record<string, any>;
};

export type DynamoDBDeleteOptions = {
  conditionExpression?: string;
  expressionAttributeNames?: any;
  expressionAttributeValues?: any;
};
