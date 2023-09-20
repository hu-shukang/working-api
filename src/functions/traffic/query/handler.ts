import { Const, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { DynamoDBQueryOptions, Key, TrafficEntity, trafficEntityToViewModel } from '@models';

const queryTraffic: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const routeId = event.queryStringParameters?.routeId;
  const { id } = event.requestContext.authorizer;
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, TRAFFIC_ROUTE, PK, SK } = Const;
  const key: Key = { pkName: PK, pkValue: id, skName: SK, skValue: TRAFFIC_ROUTE };
  const queryOptions: DynamoDBQueryOptions = { beginsWithSK: true };
  if (routeId) {
    queryOptions.filter = {
      expression: 'routeId = :routeId',
      expressionAttributeValues: {
        ':routeId': routeId
      }
    };
  }
  const entities = await dynamodbUtil.getRecords<TrafficEntity>(WORKING_TBL, key, queryOptions);
  return entities.map(trafficEntityToViewModel);
};

export const main = middyfy(queryTraffic, schema);
