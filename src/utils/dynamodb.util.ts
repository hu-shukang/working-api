import { DynamoDB } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  PutCommand,
  DeleteCommand,
  DeleteCommandOutput,
  UpdateCommand,
  UpdateCommandOutput,
  TransactWriteCommand,
  TransactWriteCommandInput,
  TransactWriteCommandOutput
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBQueryKeyError, DynamoDBQueryOptions, Key } from '@models';
import { Const } from './const.util';

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

  public async getRecords<T>(tableName: string, key: Key, queryOptions: DynamoDBQueryOptions): Promise<T[]> {
    if (queryOptions.beginsWithSK && (key.skName === undefined || key.skValue === undefined)) {
      throw new DynamoDBQueryKeyError();
    }
    const keyConditionExpression = [`#${key.pkName} = :${key.pkName}`];
    const expressionAttributeNames = {
      [`#${key.pkName}`]: key.pkName,
      ...queryOptions?.filter?.expressionAttributeNames
    };
    const expressionAttributeValues = {
      [`:${key.pkName}`]: key.pkValue,
      ...queryOptions?.filter?.expressionAttributeValues
    };
    if (queryOptions.beginsWithSK) {
      keyConditionExpression.push(`#${key.skName} = :${key.skName}`);
      expressionAttributeNames[`#${key.skName}`] = key.skName;
      expressionAttributeValues[`:${key.skName}`] = key.skValue;
    }
    const command = new QueryCommand({
      TableName: tableName,
      IndexName: queryOptions?.indexName,
      KeyConditionExpression: keyConditionExpression.join(' and '),
      FilterExpression: queryOptions?.filter?.expression,
      ProjectionExpression: queryOptions?.projectionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ExclusiveStartKey: queryOptions?.exclusiveStartKey
    });
    const result = await this.docClient.send(command);
    const list = result.Items as T[];
    if (result.LastEvaluatedKey) {
      queryOptions.exclusiveStartKey = result.LastEvaluatedKey;
      const nextList = await this.getRecords<T>(tableName, key, queryOptions);
      list.push(...nextList);
    }
    return list;
  }

  public async addRecord(tableName: string, key: Record<string, any>, attributes: Record<string, any>) {
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...attributes,
        ...key
      },
      ConditionExpression: Const.PK_NO_EXISTS_SK_NO_EXISTS
    });
    return await this.docClient.send(command);
  }

  public async deleteRecord(tableName: string, key: Record<string, any>): Promise<DeleteCommandOutput> {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
      ConditionExpression: Const.PK_EXISTS_SK_EXISTS
    });
    return await this.docClient.send(command);
  }

  public async updateRecord(
    tableName: string,
    key: Record<string, any>,
    attributes: Record<string, any>
  ): Promise<UpdateCommandOutput> {
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, any> = {};
    const expressionAttributeValues: Record<string, any> = {};
    for (const [k, v] of Object.entries(attributes)) {
      updateExpression.push(`#${k} = :${k}`);
      expressionAttributeNames[`#${k}`] = k;
      expressionAttributeValues[`:${k}`] = v;
    }
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: 'set ' + updateExpression.join(', '),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(pk) and attribute_exists(sk)'
    });
    return await this.docClient.send(command);
  }

  public async transactWrite(input: TransactWriteCommandInput): Promise<TransactWriteCommandOutput> {
    const command = new TransactWriteCommand(input);
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
}
