import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import {
  AttendanceEntity,
  AttendanceTraffic,
  DBRecord,
  DynamoDBQueryOptions,
  EmptyAttendanceError,
  Key
} from '@models';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

const { WORKING_TBL, ATTENDANCE, ATTENDANCE_TRAFFIC, SP, SUCCESS, PK, SK, TRAFFIC } = Const;

const getDBRecords = async (dynamodbUtil: DynamoDBUtil, id: string, date: string): Promise<DBRecord[]> => {
  const key: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${ATTENDANCE}${SP}${date}${SP}${TRAFFIC}` };
  const queryOptions: DynamoDBQueryOptions = {
    projectionExpression: 'pk, sk',
    beginsWithSK: true
  };
  return await dynamodbUtil.getRecords<DBRecord>(WORKING_TBL, key, queryOptions);
};

const addAttendanceTraffic: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: AttendanceTraffic[] = event.body;
  const { id } = event.requestContext.authorizer;
  const { date } = event.pathParameters;
  console.log(form);
  const dynamodbUtil = new DynamoDBUtil();
  const queryKey: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${ATTENDANCE}${SP}${dateUtil.format(date)}` };
  const record = await dynamodbUtil.getRecord<AttendanceEntity>(WORKING_TBL, queryKey);
  if (!record) {
    throw new EmptyAttendanceError();
  }
  const records = await getDBRecords(dynamodbUtil, id, date);
  const transactItems: any[] = [];
  for (const record of records) {
    transactItems.push({
      Delete: {
        TableName: WORKING_TBL,
        Key: { pk: record.pk, sk: record.sk }
      }
    });
  }
  let milliseconds = dateUtil.milliseconds();
  for (const record of form) {
    transactItems.push({
      Put: {
        TableName: WORKING_TBL,
        Item: {
          ...record,
          pk: id,
          sk: `${ATTENDANCE}${SP}${dateUtil.format(date)}${SP}${TRAFFIC}${SP}${milliseconds++}`,
          type: ATTENDANCE_TRAFFIC
        }
      }
    });
  }
  const input: TransactWriteCommandInput = {
    TransactItems: transactItems
  };
  await dynamodbUtil.transactWrite(input);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(addAttendanceTraffic, schema);
