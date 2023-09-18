import { Const } from '@utils';

export const WorkingTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    AttributeDefinitions: [
      {
        AttributeName: 'pk',
        AttributeType: 'S'
      },
      {
        AttributeName: 'sk',
        AttributeType: 'S'
      },
      {
        AttributeName: 'sub',
        AttributeType: 'S'
      },
      {
        AttributeName: 'routeId',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'pk',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'sk',
        KeyType: 'RANGE'
      }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: Const.SUB_IDX,
        KeySchema: [
          {
            AttributeName: 'sub',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      },
      {
        IndexName: Const.ROUTE_IDX,
        KeySchema: [
          {
            AttributeName: 'routeId',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    TableName: '${env:WORKING_TBL}'
  }
};
