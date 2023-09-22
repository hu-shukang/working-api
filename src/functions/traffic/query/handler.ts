import { Const, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { DynamoDBQueryOptions, Key, TrafficEntity, trafficEntityToViewModel } from '@models';

const { WORKING_TBL, TRAFFIC_ROUTE, PK, SK, SORT_IDX, SORT, SP } = Const;

const getTraffic = async (dynamodbUtil: DynamoDBUtil, id: string, routeId: string): Promise<TrafficEntity[]> => {
  const key: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${TRAFFIC_ROUTE}${SP}${routeId}` };
  const entity = await dynamodbUtil.getRecord<TrafficEntity>(WORKING_TBL, key);
  return [entity];
};

const getTrafficList = async (dynamodbUtil: DynamoDBUtil, id: string): Promise<TrafficEntity[]> => {
  const key: Key = { pkName: PK, pkValue: id, skName: SORT, skValue: TRAFFIC_ROUTE };
  const queryOptions: DynamoDBQueryOptions = { indexName: SORT_IDX, beginsWithSK: true };
  return dynamodbUtil.getRecords<TrafficEntity>(WORKING_TBL, key, queryOptions);
};

const queryTraffic: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const routeId = event.queryStringParameters?.routeId;
  const { id } = event.requestContext.authorizer;
  const dynamodbUtil = new DynamoDBUtil();
  let entities: TrafficEntity[] = [];
  if (routeId) {
    entities = await getTraffic(dynamodbUtil, id, routeId);
  } else {
    entities = await getTrafficList(dynamodbUtil, id);
  }
  return entities.map(trafficEntityToViewModel);
};

export const main = middyfy(queryTraffic, schema);
