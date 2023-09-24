import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { AttendanceEntity, EmptyAttendanceError, Key } from '@models';

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { id } = event.requestContext.authorizer;
  const { date } = event.pathParameters;
  console.log(date);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ATTENDANCE, ATTENDANCE_REPORT, SP, SUCCESS, PK, SK, REPORT, PENDING } = Const;
  const queryKey: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${ATTENDANCE}${SP}${dateUtil.format(date)}` };
  const record = await dynamodbUtil.getRecord<AttendanceEntity>(WORKING_TBL, queryKey);
  if (!record) {
    throw new EmptyAttendanceError();
  }
  const key = {
    pk: id,
    sk: `${ATTENDANCE}${SP}${date}${SP}${REPORT}`
  };
  const attributes = {
    type: ATTENDANCE_REPORT,
    approvalStatus: PENDING,
    reportDate: dateUtil.unix()
  };
  await dynamodbUtil.addRecord(WORKING_TBL, key, attributes);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(handler, schema);
