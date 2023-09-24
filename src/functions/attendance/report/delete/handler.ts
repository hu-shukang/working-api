import { Const, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { ApprovalFinishError, DynamoDBDeleteOptions } from '@models';

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { id } = event.requestContext.authorizer;
  const { date, index } = event.pathParameters;
  console.log(date, index);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ATTENDANCE, SP, SUCCESS, REPORT } = Const;
  const key = { pk: id, sk: `${ATTENDANCE}${SP}${date}${SP}${REPORT}` };
  const options: DynamoDBDeleteOptions = {
    conditionExpression: 'attribute_not_exists(approvalDate)'
  };
  try {
    await dynamodbUtil.deleteRecord(WORKING_TBL, key, options);
  } catch (e: any) {
    if (e.name === 'ConditionalCheckFailedException') {
      throw new ApprovalFinishError();
    }
    throw e;
  }

  return {
    message: SUCCESS
  };
};

export const main = middyfy(handler, schema);
