import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { AttendanceAddUpdateForm } from '@models';

const addAttendance: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: AttendanceAddUpdateForm = event.body;
  const { id } = event.requestContext.authorizer;
  console.log(form);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ATTENDANCE, SP, SUCCESS, ATTENDANCE_INFO } = Const;

  const key = { pk: id, sk: `${ATTENDANCE}${SP}${dateUtil.format(form.date)}` };
  const attributes = {
    type: ATTENDANCE_INFO,
    start: form.start,
    end: form.end,
    break: form.break,
    nightBreak: form.nightBreak,
    timeOff: form.timeOff,
    remotely: form.remotely
  };
  await dynamodbUtil.addRecord(WORKING_TBL, key, attributes, false);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(addAttendance, schema);
