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
        AttributeName: 'sort',
        AttributeType: 'S'
      },
      {
        AttributeName: 'gsi',
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
        IndexName: Const.SORT_IDX,
        KeySchema: [
          {
            AttributeName: 'pk',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'sort',
            KeyType: 'RANGE'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      },
      {
        IndexName: Const.GSI_IDX,
        KeySchema: [
          {
            AttributeName: 'pk',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'gsi',
            KeyType: 'RANGE'
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
