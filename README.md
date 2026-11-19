# jackstand

> AI-assisted characterization-test generator for legacy code, starting with PHP.

[![npm](https://img.shields.io/npm/v/jackstand)](https://www.npmjs.com/package/jackstand)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Like jack stands under a truck before you work on it, jackstand holds legacy code steady with tests
so it can be changed safely.

## Status

**Early development, not ready for use yet.** The published `0.0.x` CLI only prints its version
and help.

## The idea

Given a legacy PHP codebase, jackstand will:

1. find units of code (functions and methods)
2. have an LLM propose characterization tests (Pest or PHPUnit) that capture current behavior
3. run them in an isolated sandbox and reconcile them against what the code actually does
4. use mutation testing to prove the tests catch real changes
5. report honestly on what it could and couldn't cover

**The LLM proposes and the tool verifies:** no generated test is trusted until it has been
executed and checked.

## Try it

```sh
npx jackstand --help
```

Requires Node.js 22 or newer.

## Repository layout

| Path | What it is |
|---|---|
| [`packages/cli`](packages/cli) | The `jackstand` CLI, published to npm as [`jackstand`](https://www.npmjs.com/package/jackstand) |

## Development

```sh
nvm use          # Node version from .nvmrc
npm install
npm test         # Vitest
npm run typecheck
```

The project is built test-first.

## License

[MIT](LICENSE) © Levi Farley
