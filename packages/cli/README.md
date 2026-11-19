# jackstand

> AI-assisted characterization-test generator for legacy code, starting with PHP.

Like jack stands under a truck before you work on it, jackstand holds legacy code steady with tests
so it can be changed safely.

## Status

**Early development, not ready for use yet.** This release (`0.0.x`) only prints its version and help.

## What it will do

Given a legacy PHP codebase, jackstand will:

1. find units of code (functions and methods)
2. have an LLM propose characterization tests (Pest or PHPUnit) that capture current behavior
3. run them in an isolated sandbox and reconcile them against what the code actually does
4. use mutation testing to prove the tests catch real changes
5. report honestly on what it could and couldn't cover

The LLM proposes and the tool verifies: no generated test is trusted until it has been executed
and checked.

## Install

```sh
npx jackstand --help
```

Requires Node.js 22 or newer.

## Links

- Source: https://github.com/levifarley/jackstand
- Issues: https://github.com/levifarley/jackstand/issues

## License

MIT © Levi Farley
