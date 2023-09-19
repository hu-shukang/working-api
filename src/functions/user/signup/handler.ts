import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { SignUpForm } from '@models';

const addTraffic: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: SignUpForm = event.body;
  const { sub } = event.requestContext.authorizer;
  console.log(form);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, INFO, SUCCESS, FINISH } = Const;
  const key = { pk: sub, sk: INFO };
  const attributes = {
    pk: form.id,
    hireData: form.hireDate,
    familyName: form.familyName,
    givenName: form.givenName,
    signupStatus: FINISH,
    createUser: form.id,
    updateDate: dateUtil.unix(),
    updateUser: form.id
  };
  await dynamodbUtil.updateRecord(WORKING_TBL, key, attributes);
  return {
    message: SUCCESS
  };
};

export const main = middyfy(addTraffic, schema);
