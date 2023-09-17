import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Key, PK, RequiredKey } from '@models';

export class DynamoDBUtil {
  protected docClient: DynamoDBDocumentClient;

  constructor() {
    const dbClient = new DynamoDB();

    const marshallOptions = {
      // 空の文字列、バイナリ、およびセットを自動的に「null」に変換するか
      convertEmptyValues: false, // デフォルト値：false
      // 挿入時に未定義の値を削除するか
      removeUndefinedValues: true, // デフォルト値：false
      // オブジェクトを map 型に変換するか
      convertClassInstanceToMap: false // デフォルト値：false
    };

    const unmarshallOptions = {
      // 数値をJavaScriptのNumber型に変換するのではなく、文字列として返すか
      wrapNumbers: false // デフォルト値：false
    };

    const translateConfig = { marshallOptions, unmarshallOptions };
    this.docClient = DynamoDBDocumentClient.from(dbClient, translateConfig);
  }

  /**
   * Singleのレコードを取得する
   *
   * @param tableName テーブル名
   * @param key Key情報
   * @returns レコードか、undefined
   */
  getRecord<T>(tableName: string, key: Key): Promise<T | undefined>;

  /**
   * GSIでSingleのレコードを取得する
   *
   * @param tableName テーブル名
   * @param indexName インデックス名
   * @param key Key情報
   * @returns レコードか、undefined
   */
  getRecord<T>(tableName: string, indexName: string, key: Key): Promise<T | undefined>;

  public async getRecord<T>(p1: string, p2: string | Key, p3?: Key): Promise<T | undefined> {
    if (p3) {
      return this.getRecordWithGSI<T>(p1, p2 as string, p3);
    }
    return this.getRecordWithKey<T>(p1, p2 as Key);
  }

  /**
   * Singleのレコードを取得する
   *
   * @param tableName テーブル名
   * @param key Key情報
   * @returns レコードリスト
   */
  getRecords<T>(tableName: string, key: PK): Promise<T[]>;
  /**
   * Singleのレコードを取得する
   *
   * @param tableName テーブル名
   * @param key RequiredKey情報
   * @param beginsWith 前方一致
   * @returns レコードリスト
   */
  getRecords<T>(tableName: string, key: RequiredKey, beginsWith: true): Promise<T[]>;

  /**
   * GSIでSingleのレコードを取得する
   *
   * @param tableName テーブル名
   * @param indexName インデックス名
   * @param key Key情報
   * @returns レコードリスト
   */
  getRecords<T>(tableName: string, indexName: string, key: Key): Promise<T[]>;

  /**
   * GSIでSingleのレコードを取得する
   *
   * @param tableName テーブル名
   * @param indexName インデックス名
   * @param key RequiredKey情報
   * @param beginsWith 前方一致
   * @returns レコードリスト
   */
  getRecords<T>(tableName: string, indexName: string, key: RequiredKey, beginsWith: true): Promise<T[]>;

  public async getRecords<T>(
    p1: string,
    p2: string | PK | RequiredKey,
    p3?: boolean | Key,
    p4?: boolean
  ): Promise<T[]> {
    if (p3 === undefined && p4 === undefined) {
      return await this.getRecordsWithPK<T>(p1, p2 as PK);
    } else if (p3 != undefined && typeof p3 === 'boolean') {
      return await this.getRecordsBeginWithKey<T>(p1, p2 as RequiredKey);
    } else if (p3 != undefined && typeof p3 != 'boolean') {
      return await this.getRecordsWithGSI(p1, p2 as string, p3 as Key);
    } else if (p4 != undefined) {
      return await this.getRecordsBeginWithGSI(p1, p2 as string, p3 as RequiredKey);
    }
    return [];
  }

  public async addRecord(tableName: string, key: Record<string, any>, attributes: Record<string, any>) {
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...attributes,
        ...key
      },
      ConditionExpression: 'attribute_not_exists(pk) and attribute_not_exists(sk)'
    });
    return await this.docClient.send(command);
  }

  private async getRecordWithKey<T>(tableName: string, key: Key): Promise<T | undefined> {
    const k = { [key.pkName]: key.pkValue, [key.skName]: key.skValue };
    const command = new GetCommand({
      TableName: tableName,
      Key: k
    });
    const result = await this.docClient.send(command);
    return result.Item as T;
  }

  private async getRecordWithGSI<T>(tableName: string, indexName: string, key: Key): Promise<T | undefined> {
    const keyConditionExpression: string[] = [`#${key.pkName} = :${key.pkName}`];
    const expressionAttributeNames = { [`#${key.pkName}`]: key.pkName };
    const expressionAttributeValues = { [`:${key.pkName}`]: key.pkValue };
    if (key.skName && key.skValue) {
      keyConditionExpression.push(`#${key.skName} = :${key.skName}`);
      expressionAttributeNames[`#${key.skName}`] = key.skName;
      expressionAttributeValues[`:${key.skName}`] = key.skValue;
    }
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: keyConditionExpression.join(' and '),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    });
    console.log(command.input);
    const result = await this.docClient.send(command);
    if (result.Count === 0) {
      return undefined;
    }
    return result.Items[0] as T;
  }

  private async getRecordsWithPK<T>(tableName: string, key: PK, exclusiveStartKey?: any): Promise<T[]> {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: `#${key.pkName} = :${key.pkName}`,
      ExpressionAttributeNames: {
        [`#${key.pkName}`]: key.pkName
      },
      ExpressionAttributeValues: {
        [`:${key.pkName}`]: key.pkValue
      },
      ExclusiveStartKey: exclusiveStartKey
    });
    const result = await this.docClient.send(command);
    const list = result.Items as T[];
    if (result.LastEvaluatedKey) {
      const nextList = await this.getRecordsWithPK<T>(tableName, key, result.LastEvaluatedKey);
      list.push(...nextList);
    }
    return list;
  }

  private async getRecordsBeginWithKey<T>(tableName: string, key: RequiredKey, exclusiveStartKey?: any): Promise<T[]> {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: `#${key.pkName} = :${key.pkName} and begins_with(#{${key.skName}}, :${key.skName})`,
      ExpressionAttributeNames: {
        [`#${key.pkName}`]: key.pkName,
        [`#${key.skName}`]: key.skName
      },
      ExpressionAttributeValues: {
        [`:${key.pkName}`]: key.pkValue,
        [`:${key.skName}`]: key.skValue
      },
      ExclusiveStartKey: exclusiveStartKey
    });
    const result = await this.docClient.send(command);
    const list = result.Items as T[];
    if (result.LastEvaluatedKey) {
      const nextList = await this.getRecordsBeginWithKey<T>(tableName, key, result.LastEvaluatedKey);
      list.push(...nextList);
    }
    return list;
  }

  private async getRecordsWithGSI<T>(
    tableName: string,
    indexName: string,
    key: Key,
    exclusiveStartKey?: any
  ): Promise<T[]> {
    const keyConditionExpression: string[] = [`#${key.pkName} = :${key.pkName}`];
    const expressionAttributeNames = { [`#${key.pkName}`]: key.pkName };
    const expressionAttributeValues = { [`:${key.pkName}`]: key.pkValue };
    if (key.skName && key.skValue) {
      keyConditionExpression.push(`#${key.skName} = :${key.skName}`);
      expressionAttributeNames[`#${key.skName}`] = key.skName;
      expressionAttributeValues[`:${key.skName}`] = key.skValue;
    }
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: keyConditionExpression.join(' and '),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    });
    const result = await this.docClient.send(command);
    const list = result.Items as T[];
    if (result.LastEvaluatedKey) {
      const nextList = await this.getRecordsWithGSI<T>(tableName, indexName, key, exclusiveStartKey);
      list.push(...nextList);
    }
    return list;
  }

  private async getRecordsBeginWithGSI<T>(
    tableName: string,
    indexName: string,
    key: RequiredKey,
    exclusiveStartKey?: any
  ): Promise<T[]> {
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: `#${key.pkName} = :${key.pkName} and begins_with(#{${key.skName}}, :${key.skName})`,
      ExpressionAttributeNames: {
        [`#${key.pkName}`]: key.pkName,
        [`#${key.skName}`]: key.skName
      },
      ExpressionAttributeValues: {
        [`:${key.pkName}`]: key.pkValue,
        [`:${key.skName}`]: key.skValue
      },
      ExclusiveStartKey: exclusiveStartKey
    });
    const result = await this.docClient.send(command);
    const list = result.Items as T[];
    if (result.LastEvaluatedKey) {
      const nextList = await this.getRecordsBeginWithGSI<T>(tableName, indexName, key, result.LastEvaluatedKey);
      list.push(...nextList);
    }
    return list;
  }
}
