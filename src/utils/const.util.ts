export const Const = {
  // DynamoDB
  SP: '#',
  PK: 'pk',
  SK: 'sk',
  GSI: 'gsi',
  SORT: 'sort',
  SUB_IDX: 'SUB_IDX',
  SORT_IDX: 'SORT_IDX',
  GSI_IDX: 'GSI_IDX',
  INFO: 'INFO',
  INIT: 'INIT',
  ROUTE_ID: 'routeId',
  EMPLOYEE_INFO: 'EMPLOYEE_INFO',
  FINISH: 'FINISH',
  PENDING: 'PENDING',
  TRAFFIC_ROUTE: 'TRAFFIC_ROUTE',
  ATTENDANCE: 'ATTENDANCE',
  ATTENDANCE_INFO: 'ATTENDANCE_INFO',
  ATTENDANCE_TRAFFIC: 'ATTENDANCE_TRAFFIC',
  ATTENDANCE_MONTH_TRAFFIC: 'ATTENDANCE_MONTH_TRAFFIC',
  ATTENDANCE_REPORT: 'ATTENDANCE_REPORT',
  REPORT: 'REPORT',
  TRAFFIC: 'TRAFFIC',
  WORKING_TBL: process.env.WORKING_TBL,
  PK_EXISTS_SK_EXISTS: 'attribute_exists(pk) and attribute_exists(sk)',
  PK_NO_EXISTS_SK_NO_EXISTS: 'attribute_not_exists(pk) and attribute_not_exists(sk)',
  // OAuth2
  GOOGLE_CLIENT_ID_NAME: '/working-api/google-client-id',
  GOOGLE_CLIENT_SECRET_NAME: '/working-api/google-client-secret',
  JWT_SECRET_NAME: '/working-api/jwt-secret',
  // APIGateway
  COMMON_AUTHORIZER: {
    name: 'commonAuthorizer',
    resultTtlInSeconds: 300,
    identitySource: 'method.request.header.Authorization, context.httpMethod, context.path',
    type: 'request'
  },
  SIGNUP_STATUS_AUTHORIZER: {
    name: 'signupStatusAuthorizer',
    resultTtlInSeconds: 300,
    identitySource: 'method.request.header.Authorization, context.httpMethod, context.path',
    type: 'request'
  },
  // 権限
  ROLE_ADMIN: 'admin',
  ROLE_EMPLOYEE: 'employee',
  // 日付
  FORMAT_YYYY_MM_DD_HH_mm_ss: 'YYYY-MM-DD HH:mm:ss',
  FORMAT_YYYY_MM_DD: 'YYYY-MM-DD',
  FORMAT_YYYY_MM: 'YYYY-MM',
  // other
  SUCCESS: 'success'
} as const;

export const BusinessErrorCodes = {
  S00: 'S00',
  S01: 'S01',
  S02: 'S02',
  S03: 'S03',
  S04: 'S04',
  S05: 'S05',
  S06: 'S06',
  S07: 'S07',
  S99: 'S99'
};

export const BusinessErrorCodeMessages = {
  S00: 'クライアントからのリクエストは不正です。',
  S01: 'ユーザは削除されてました。管理者にご連絡ください。',
  S02: '該当権限はありません。',
  S03: '検索キーは不正です。',
  S04: 'ユーザは存在しないです。',
  S05: '削除対象は存在しないです。',
  S06: '該当日の勤務データは未登録です。',
  S07: '承認済のため削除できません。',
  S99: 'その他のエラー。'
};
