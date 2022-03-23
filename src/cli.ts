#!/usr/bin/env node

import { Command } from 'commander'

import serve from './cli/serve'

const program = new Command()
const version = require('../package.json').version
program
  .version(version, '-v, --version', 'output the version number')
  .addCommand(serve)

program.parse(process.argv)
