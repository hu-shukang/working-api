import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { TrafficAddUpdateForm, TrafficEntity } from '@models';

const updateTraffic: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: TrafficAddUpdateForm = event.body;
  const { id } = event.requestContext.authorizer;
  const { routeId } = event.pathParameters;
  console.log(form);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, SUCCESS, ROUTE_IDX, ROUTE_ID } = Const;
  let key: any = { pkName: ROUTE_ID, pkValue: routeId };
  const entity = await dynamodbUtil.getRecord<TrafficEntity>(WORKING_TBL, ROUTE_IDX, key);
  key = { pk: entity.pk, sk: entity.sk };
  const attributes = {
    ...form,
    updateDate: dateUtil.unix(),
    updateUser: id
  };
  await dynamodbUtil.updateRecord(WORKING_TBL, key, attributes);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(updateTraffic, schema);
