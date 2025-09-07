#!/usr/bin/env node
const path = require('path');
const { execSync } = require('child_process');

// Path to proto files
const protoPath = path.resolve(__dirname, 'proto');
const outPath = path.resolve(__dirname, 'src');

// Make sure output folder exists
require('fs').mkdirSync(outPath, { recursive: true });

// Use pnpm exec to call protoc + ts-proto plugin
const pluginPath = path.resolve(
  __dirname,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'protoc-gen-ts_proto.cmd' : 'protoc-gen-ts_proto'
);

const protocCmd = [
  `protoc`,
  `--plugin=protoc-gen-ts_proto=${pluginPath}`,
  `--ts_proto_out=${outPath}`,
  `--proto_path=${protoPath}`,
  `${protoPath}/*.proto`,
  `--ts_proto_opt=esModuleInterop=true,outputServices=grpc-js`
].join(' ');

console.log('Running:', protocCmd);
execSync(protocCmd, { stdio: 'inherit' });
