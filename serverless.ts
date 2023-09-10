import type { AWS } from '@serverless/typescript';
import { WorkingTable } from '@resources/dynamodb';
import { getToken, refreshToken, tokenAuthorizer } from '@functions/index';
import { readFileSync } from 'fs';
import * as path from 'path';

const packageJson = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const allDependencies = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {})
];
const serverlessConfiguration: AWS = {
  service: 'working-api',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-dotenv-plugin', 'serverless-esbuild', 'serverless-layers'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'ap-northeast-1',
    deploymentBucket: { name: 'working-api-deploy' },
    role: '${env:LAMBDA_ROLE}',
    apiGateway: {
      stage: 'api',
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    }
  },
  resources: {
    Resources: {
      // DynamoDB
      WorkingTable
    }
  },
  // import the function via paths
  functions: { getToken, refreshToken, tokenAuthorizer },
  package: { individually: true, exclude: ['src/layers/**'], excludeDevDependencies: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: allDependencies,
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    },
    'serverless-layers': [
      {
        common: {
          dependenciesPath: './src/layers/common_layer/package.json'
        }
      }
    ]
  }
};

module.exports = serverlessConfiguration;
