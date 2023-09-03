import type { AWS } from '@serverless/typescript';
import { UserPool, UserPoolClient, UserPoolDomain, UserPoolIdentityProvider } from "@resources/cognito";
import hello from '@functions/hello';
import { WorkingTable } from '@resources/dynamodb';
import { CognitoAuthorizer } from '@resources/authorizer';

const serverlessConfiguration: AWS = {
  service: 'working-api',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-dotenv-plugin', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'ap-northeast-1',
    deploymentBucket: {name: 'working-api-deploy'},
    role: '${env:LAMBDA_ROLE}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
  },
  resources: {
    Resources: {
      // Cognito
      UserPool,
      UserPoolDomain,
      UserPoolIdentityProvider,
      UserPoolClient,
      // DynamoDB
      WorkingTable,
      // ApiGateway
      CognitoAuthorizer
    },
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    // dotenv: {
    //   path: "env/.env.${opt:stage}"
    // }
  },
};

module.exports = serverlessConfiguration;
