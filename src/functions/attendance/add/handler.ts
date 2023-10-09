import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { AttendanceAddUpdateForm, DBRecord, DynamoDBQueryOptions, Key } from '@models';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

const {
  WORKING_TBL,
  ATTENDANCE,
  SP,
  PK,
  SK,
  TRAFFIC,
  SUCCESS,
  ATTENDANCE_INFO,
  ATTENDANCE_REPORT,
  FORMAT_YYYY_MM,
  ATTENDANCE_TRAFFIC
} = Const;

const getTrafficRecords = async (dynamodbUtil: DynamoDBUtil, id: string, date: string): Promise<DBRecord[]> => {
  const key: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${ATTENDANCE}${SP}${date}${SP}${TRAFFIC}` };
  const queryOptions: DynamoDBQueryOptions = {
    projectionExpression: 'pk, sk',
    beginsWithSK: true
  };
  return await dynamodbUtil.getRecords<DBRecord>(WORKING_TBL, key, queryOptions);
};

const handler: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: AttendanceAddUpdateForm = event.body;
  const { id } = event.requestContext.authorizer;
  console.log(form);
  const yyyyMMDD = dateUtil.format(form.date);
  const yyyyMM = dateUtil.format(form.date, FORMAT_YYYY_MM);
  const dynamodbUtil = new DynamoDBUtil();
  const transactItems: any[] = [
    {
      Put: {
        TableName: WORKING_TBL,
        Item: {
          pk: id,
          sk: `${ATTENDANCE}${SP}${yyyyMMDD}`,
          type: ATTENDANCE_INFO,
          start: form.start,
          end: form.end,
          break: form.break,
          nightBreak: form.nightBreak,
          timeOff: form.timeOff,
          remotely: form.remotely,
          comment: form.comment
        }
      }
    },
    {
      Put: {
        TableName: WORKING_TBL,
        Item: {
          pk: id,
          sk: `${ATTENDANCE}${SP}${yyyyMM}`,
          type: ATTENDANCE_REPORT,
          gsi: `${ATTENDANCE_REPORT}${SP}${yyyyMM}`
        },
        ConditionExpression: 'attribute_not_exists(reportDate)'
      }
    }
  ];
  const traffics = await getTrafficRecords(dynamodbUtil, id, form.date);
  for (const record of traffics) {
    transactItems.push({
      Delete: {
        TableName: WORKING_TBL,
        Key: { pk: record.pk, sk: record.sk }
      }
    });
  }
  let milliseconds = dateUtil.milliseconds();
  for (const record of form.trafficList ?? []) {
    transactItems.push({
      Put: {
        TableName: WORKING_TBL,
        Item: {
          ...record,
          pk: id,
          sk: `${ATTENDANCE}${SP}${yyyyMMDD}${SP}${TRAFFIC}${SP}${milliseconds++}`,
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

export const main = middyfy(handler, schema);
