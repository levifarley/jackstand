import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { run } from '../src/cli.js';

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { name: string; version: string; description: string };

function exec(argv: string[]) {
  let stdout = '';
  let stderr = '';
  const code = run(argv, {
    stdout: (s) => (stdout += s),
    stderr: (s) => (stderr += s),
  });
  return { code, stdout, stderr };
}

describe('--version', () => {
  it.each(['--version', '-v'])('%s prints the package.json version and exits 0', (flag) => {
    const r = exec([flag]);
    expect(r.code).toBe(0);
    expect(r.stdout).toBe(`${pkg.version}\n`);
    expect(r.stderr).toBe('');
  });
});

describe('help', () => {
  it.each([[[]], [['--help']], [['-h']]])('%j prints help and exits 0', (argv) => {
    const r = exec(argv);
    expect(r.code).toBe(0);
    expect(r.stderr).toBe('');
    expect(r.stdout).toContain(`${pkg.name} ${pkg.version}`);
    expect(r.stdout).toContain(pkg.description);
    expect(r.stdout).toContain('early development — not ready for use yet');
    expect(r.stdout).toContain('https://github.com/levifarley/jackstand');
  });
});

describe('unknown arguments', () => {
  it.each([[['foo']], [['--nope']], [['--version', 'extra']]])(
    '%j prints an error with a help hint and exits 2',
    (argv) => {
      const r = exec(argv);
      expect(r.code).toBe(2);
      expect(r.stdout).toBe('');
      expect(r.stderr).toContain(`unknown argument '${argv.at(-1)}'`);
      expect(r.stderr).toContain('jackstand --help');
    },
  );
});
