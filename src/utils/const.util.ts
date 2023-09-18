export const Const = {
  // DynamoDB
  SP: '#',
  PK: 'pk',
  SK: 'sk',
  SUB_IDX: 'SUB_IDX',
  ROUTE_IDX: 'ROUTE_IDX',
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
  COMMON_AUTHORIZER: 'commonAuthorizer',
  SIGNUP_STATUS_AUTHORIZER: 'signupStatusAuthorizer',
  // 権限
  ROLE_ADMIN: 'admin',
  ROLE_EMPLOYEE: 'employee',
  // other
  SUCCESS: 'success'
} as const;

export const BusinessErrorCodes = {
  S00: 'S00',
  S01: 'S01',
  S02: 'S02',
  S03: 'S03',
  S99: 'S99'
};

export const BusinessErrorCodeMessages = {
  S00: 'クライアントからのリクエストは不正です。',
  S01: 'ユーザは削除されてました。管理者にご連絡ください。',
  S02: '該当権限はありません。',
  S03: '検索キーは不正です。',
  S99: 'その他のエラー。'
};
