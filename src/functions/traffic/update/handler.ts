import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { TrafficAddUpdateForm } from '@models';

const updateTraffic: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: TrafficAddUpdateForm = event.body;
  const { id } = event.requestContext.authorizer;
  const { routeId } = event.pathParameters;
  console.log(form);
  const { WORKING_TBL, SUCCESS, TRAFFIC_ROUTE, SP } = Const;
  const dynamodbUtil = new DynamoDBUtil();
  const key = { pk: id, sk: `${TRAFFIC_ROUTE}${SP}${routeId}` };
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
