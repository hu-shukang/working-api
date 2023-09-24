import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { AttendanceEntity, AttendanceTraffic, EmptyAttendanceError, Key } from '@models';

const addAttendanceTraffic: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: AttendanceTraffic = event.body;
  const { id } = event.requestContext.authorizer;
  const { date } = event.pathParameters;
  console.log(form);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ATTENDANCE, ATTENDANCE_TRAFFIC, SP, SUCCESS, PK, SK, TRAFFIC } = Const;
  const queryKey: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${ATTENDANCE}${SP}${dateUtil.format(date)}` };
  const record = await dynamodbUtil.getRecord<AttendanceEntity>(WORKING_TBL, queryKey);
  if (!record) {
    throw new EmptyAttendanceError();
  }
  const key = {
    pk: id,
    sk: `${ATTENDANCE}${SP}${dateUtil.format(date)}${SP}${TRAFFIC}${SP}${dateUtil.milliseconds()}`
  };
  const attributes = {
    ...form,
    type: ATTENDANCE_TRAFFIC
  };
  await dynamodbUtil.addRecord(WORKING_TBL, key, attributes);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(addAttendanceTraffic, schema);
