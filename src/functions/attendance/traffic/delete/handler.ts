import { Const, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { DynamoDBQueryOptions, DBRecord, Key } from '@models';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

const deleteAttendanceTraffic: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { id } = event.requestContext.authorizer;
  const { date, index } = event.pathParameters;
  console.log(date, index);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ATTENDANCE, SP, SUCCESS, TRAFFIC, PK, SK } = Const;
  const key: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${ATTENDANCE}${SP}${date}${SP}${TRAFFIC}` };
  const queryOptions: DynamoDBQueryOptions = {
    projectionExpression: 'pk, sk',
    beginsWithSK: true
  };
  const records = await dynamodbUtil.getRecords<DBRecord>(WORKING_TBL, key, queryOptions);
  if (records.length > 0) {
    const transactItems: any[] = [];
    for (const record of records) {
      transactItems.push({
        Delete: {
          TableName: WORKING_TBL,
          Key: { pk: record.pk, sk: record.sk }
        }
      });
    }
    const input: TransactWriteCommandInput = {
      TransactItems: transactItems
    };
    await dynamodbUtil.transactWrite(input);
  }
  return {
    message: SUCCESS
  };
};

export const main = middyfy(deleteAttendanceTraffic, schema);
