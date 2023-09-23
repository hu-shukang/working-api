import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { CommonAttributes, DeleteEmptyError, Key } from '@models';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

const deleteAttendance: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { date } = event.pathParameters;
  const { id } = event.requestContext.authorizer;
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ATTENDANCE, SUCCESS, SP, PK, SK } = Const;
  const key: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${ATTENDANCE}${SP}${dateUtil.format(date)}` };
  const records = await dynamodbUtil.getRecords<CommonAttributes>(WORKING_TBL, key, { beginsWithSK: true });
  if (records.length === 0) {
    throw new DeleteEmptyError();
  }
  const input: TransactWriteCommandInput = {
    TransactItems: records.map((item) => ({
      Delete: {
        TableName: WORKING_TBL,
        Key: { pk: item.pk, sk: item.sk }
      }
    }))
  };
  await dynamodbUtil.transactWrite(input);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(deleteAttendance, schema);
