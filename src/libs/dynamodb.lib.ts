import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Key } from '@models/common.model';

export class DynamoDBLib {
  protected docClient: DynamoDBDocumentClient;

  constructor() {
    const dbClient = new DynamoDB();

    const marshallOptions = {
      // 空の文字列、バイナリ、およびセットを自動的に「null」に変換するか
      convertEmptyValues: false, // デフォルト値：false
      // 挿入時に未定義の値を削除するか
      removeUndefinedValues: false, // デフォルト値：false
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
    return this.getRecordWithPK<T>(p1, p2 as Key);
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

  private async getRecordWithPK<T>(tableName: string, key: Key): Promise<T | undefined> {
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
