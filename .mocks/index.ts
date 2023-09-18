#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { spawn } from 'child_process';

const argv = yargs(process.argv.slice(2))
  .options({
    stage: { type: 'string', default: 'it', alias: 's' },
    function: { type: 'string', demandOption: true, alias: 'f' },
    dataName: { type: 'string', demandOption: true, alias: 'd' }
  })
  .parseSync();

const func = argv.function;
const dataName = argv.dataName;
const data = require(`./${func}/${dataName}.ts`).default;
data.headers.Authorization = 'xxx';
if (data.body) {
  data.body = JSON.stringify(data.body);
}

const command = `serverless`;
const args = ['invoke', 'local', '--stage', argv.stage, '--function', func, '--data', JSON.stringify(data)];
const childProcess = spawn(command, args);

childProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
});

childProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

childProcess.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
