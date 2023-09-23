import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';

const deleteAttendanceTraffic: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { id } = event.requestContext.authorizer;
  const { date, index } = event.pathParameters;
  console.log(date, index);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ATTENDANCE, SP, SUCCESS, TRAFFIC } = Const;
  const key = { pk: id, sk: `${ATTENDANCE}${SP}${dateUtil.format(date)}${SP}${TRAFFIC}${SP}${index}` };
  await dynamodbUtil.deleteRecord(WORKING_TBL, key);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(deleteAttendanceTraffic, schema);
