import { Const, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { TrafficSortForm } from '@models';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

const addTraffic: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: TrafficSortForm = event.body;
  const { id } = event.requestContext.authorizer;
  console.log(form);
  const { WORKING_TBL, TRAFFIC_ROUTE, SP, SUCCESS } = Const;
  const input: TransactWriteCommandInput = {
    TransactItems: form.map((item) => ({
      Update: {
        TableName: WORKING_TBL,
        Key: { pk: id, sk: `${TRAFFIC_ROUTE}${SP}${item.routeId}` },
        UpdateExpression: 'set #sort = :sort',
        ExpressionAttributeNames: {
          '#sort': 'sort'
        },
        ExpressionAttributeValues: {
          ':sort': `${TRAFFIC_ROUTE}${SP}${item.index}`
        },
        ConditionExpression: Const.PK_EXISTS_SK_EXISTS
      }
    }))
  };
  const dynamodbUtil = new DynamoDBUtil();
  await dynamodbUtil.transactWrite(input);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(addTraffic, schema);
