import { Const, DynamoDBUtil, JwtUtil, middyfy, ParameterUtil, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema, bodySchema } from './schema';
import { EmployeeDeletedError, EmployeeEmptyError, EmployeeInfoEntity, Key, SignUpForm } from '@models';
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

const addTraffic: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  const form: SignUpForm = event.body;
  const { id } = event.requestContext.authorizer;
  console.log(form);
  const dynamodbUtil = new DynamoDBUtil();
  const { WORKING_TBL, INFO, PK, SK, FINISH } = Const;
  const key: Key = { pkName: PK, pkValue: id, skName: SK, skValue: INFO };
  const employeeInfo = await dynamodbUtil.getRecord<EmployeeInfoEntity>(WORKING_TBL, key);
  if (!employeeInfo) {
    throw new EmployeeEmptyError();
  }
  if (employeeInfo.deleted) {
    throw new EmployeeDeletedError();
  }
  const newEmployeeInfo: EmployeeInfoEntity = {
    ...employeeInfo,
    pk: form.id,
    hireDate: form.hireDate,
    familyName: form.familyName,
    givenName: form.givenName,
    createUser: form.id,
    signupStatus: FINISH
  };
  const input: TransactWriteCommandInput = {
    TransactItems: [
      {
        Delete: {
          TableName: WORKING_TBL,
          Key: { pk: id, sk: INFO }
        }
      },
      {
        Put: {
          TableName: WORKING_TBL,
          Item: newEmployeeInfo
        }
      }
    ]
  };
  await dynamodbUtil.transactWrite(input);
  const parameterUtil = new ParameterUtil();
  const jwtSecret = await parameterUtil.getJwtSecret();

  const jwtUtil = new JwtUtil();
  const payload = {
    id: form.id,
    signupStatus: Const.FINISH,
    role: employeeInfo.role
  };
  const accessToken = jwtUtil.signAccessToken(payload, jwtSecret);
  return {
    accessToken
  };
};

export const main = middyfy(addTraffic, schema);
