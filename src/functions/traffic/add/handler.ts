import { Const, dateUtil, DynamoDBUtil, middyfy, stringUtil, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { DynamoDBQueryOptions, Key, TrafficAddForm, TrafficEntity, trafficEntityToViewModel } from '@models';

const addTraffic: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: TrafficAddForm = event.body;
  const { id } = event.requestContext.authorizer;
  console.log(form);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, TRAFFIC_ROUTE, SP, PK, SK } = Const;
  let key: Required<Key> = { pkName: PK, pkValue: id, skName: SK, skValue: TRAFFIC_ROUTE };
  const queryOptions: DynamoDBQueryOptions = { beginsWithSK: true };
  const entities = await dynamodbUtil.getRecords<TrafficEntity>(WORKING_TBL, key, queryOptions);
  const index = entities.length;
  key = { pkName: PK, pkValue: id, skName: SK, skValue: `${TRAFFIC_ROUTE}${SP}${index}` };
  const attributes = {
    ...form,
    type: TRAFFIC_ROUTE,
    routeId: stringUtil.uuid(),
    createDate: dateUtil.unix(),
    createUser: id
  };
  await dynamodbUtil.addRecord(WORKING_TBL, key, attributes);
  return trafficEntityToViewModel(Object.assign({}, { pk: key.pkValue, sk: key.skValue }, attributes));
};

export const main = middyfy(addTraffic, schema);
