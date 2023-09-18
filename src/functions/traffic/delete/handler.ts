import { Const, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { AuthorityLimitError, Key, TrafficEntity } from '@models';

const deleteTraffic: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { routeId } = event.pathParameters;
  const { id } = event.requestContext.authorizer;
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, ROUTE_IDX, SUCCESS } = Const;
  const key: Key = { pkName: 'routeId', pkValue: routeId };
  const traffic = await dynamodbUtil.getRecord<TrafficEntity>(WORKING_TBL, ROUTE_IDX, key);
  if (traffic.pk !== id) {
    throw new AuthorityLimitError();
  }
  await dynamodbUtil.deleteRecord(WORKING_TBL, { pk: id, sk: traffic.sk });
  return {
    message: SUCCESS
  };
};

export const main = middyfy(deleteTraffic, schema);
