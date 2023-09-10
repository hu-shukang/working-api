export const Const = {
  // DynamoDB
  SUB_IDX: 'SUB_IDX',
  INFO: 'INFO',
  INIT: 'INIT',
  EMPLOYEE_INFO: 'EMPLOYEE_INFO',
  FINISH: 'FINISH',
  PENDING: 'PENDING',
  // Google
  GOOGLE_CLIENT_ID_NAME: '/working-api/google-client-id',
  GOOGLE_CLIENT_SECRET_NAME: '/working-api/google-client-secret',
  // APIGateway
  TOKEN_AUTHORIZER: 'tokenAuthorizer',
  // 権限
  ROLE_ADMIN: 'admin',
  ROLE_EMPLOYEE: 'employee'
} as const;
