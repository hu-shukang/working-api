import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { AttendanceAddUpdateForm } from '@models';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

const addAttendance: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: AttendanceAddUpdateForm = event.body;
  const { id } = event.requestContext.authorizer;
  console.log(form);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ATTENDANCE, SP, SUCCESS, ATTENDANCE_INFO, ATTENDANCE_REPORT, FORMAT_YYYY_MM } = Const;

  const input: TransactWriteCommandInput = {
    TransactItems: [
      {
        Put: {
          TableName: WORKING_TBL,
          Item: {
            pk: id,
            sk: `${ATTENDANCE}${SP}${dateUtil.format(form.date)}`,
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
            sk: `${ATTENDANCE}${SP}${dateUtil.format(form.date, FORMAT_YYYY_MM)}`,
            type: ATTENDANCE_REPORT,
            gsi: `${ATTENDANCE_REPORT}${SP}${dateUtil.format(form.date, FORMAT_YYYY_MM)}`
          },
          ConditionExpression: 'attribute_not_exists(reportDate)'
        }
      }
    ]
  };
  await dynamodbUtil.transactWrite(input);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(addAttendance, schema);
