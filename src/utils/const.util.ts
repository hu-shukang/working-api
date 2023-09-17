export const Const = {
  // DynamoDB
  SP: '#',
  PK: 'pk',
  SK: 'sk',
  SUB_IDX: 'SUB_IDX',
  INFO: 'INFO',
  INIT: 'INIT',
  EMPLOYEE_INFO: 'EMPLOYEE_INFO',
  FINISH: 'FINISH',
  PENDING: 'PENDING',
  TRAFFIC_ROUTE: 'TRAFFIC_ROUTE',
  WORKING_TBL: process.env.WORKING_TBL,
  // Google
  GOOGLE_CLIENT_ID_NAME: '/working-api/google-client-id',
  GOOGLE_CLIENT_SECRET_NAME: '/working-api/google-client-secret',
  // APIGateway
  TOKEN_AUTHORIZER: 'tokenAuthorizer',
  // 権限
  ROLE_ADMIN: 'admin',
  ROLE_EMPLOYEE: 'employee'
} as const;
