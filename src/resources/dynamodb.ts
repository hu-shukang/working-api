export const WorkingTable = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    AttributeDefinitions: [
      {
        AttributeName: "pk",
        AttributeType: "S",
      },
      {
        AttributeName: "sk",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "pk",
        KeyType: "HASH",
      },
      {
        AttributeName: "sk",
        KeyType: "RANGE",
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
    TableName: "${env:WORKING_TBL}",
  },
};
