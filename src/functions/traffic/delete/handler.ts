import { Const, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { DynamoDBDeleteOptions } from '@models';

const deleteTraffic: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { routeId } = event.pathParameters;
  const { id } = event.requestContext.authorizer;
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, TRAFFIC_ROUTE, SUCCESS, SP } = Const;
  const key = { pk: id, sk: `${TRAFFIC_ROUTE}${SP}${routeId}` };
  const options: DynamoDBDeleteOptions = {
    conditionExpression: 'pk = :pk',
    expressionAttributeValues: { ':pk': id }
  };
  await dynamodbUtil.deleteRecord(WORKING_TBL, key, options);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(deleteTraffic, schema);
