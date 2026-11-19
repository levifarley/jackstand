#!/usr/bin/env node
// SPDX-License-Identifier: MIT
import { run } from './cli.js';

process.exitCode = run(process.argv.slice(2), {
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text),
});
