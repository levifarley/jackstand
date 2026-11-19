// Packaging checks: builds the CLI, then verifies the real published artifact.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const pkgDir = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  version: string;
  dependencies?: Record<string, string>;
};

beforeAll(() => {
  execFileSync('npm', ['run', 'build'], { cwd: pkgDir, stdio: 'pipe' });
}, 60_000);

describe('npm package', () => {
  it('has zero runtime dependencies', () => {
    expect(pkg.dependencies ?? {}).toEqual({});
  });

  it('npm pack includes only the intended files', () => {
    const out = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
      cwd: pkgDir,
      encoding: 'utf8',
    });
    const [info] = JSON.parse(out) as [{ files: { path: string }[] }];
    const files = info.files.map((f) => f.path).sort();
    expect(files).toEqual(['LICENSE', 'README.md', 'dist/bin.js', 'dist/cli.js', 'package.json']);
  }, 60_000);

  it('built bin runs under node and prints the version', () => {
    const r = spawnSync(process.execPath, ['dist/bin.js', '--version'], {
      cwd: pkgDir,
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toBe(`${pkg.version}\n`);
  });

  it('built bin starts with a node shebang', () => {
    const bin = readFileSync(new URL('../dist/bin.js', import.meta.url), 'utf8');
    expect(bin.startsWith('#!/usr/bin/env node\n')).toBe(true);
  });

  it('built bin exits non-zero on an unknown argument', () => {
    const r = spawnSync(process.execPath, ['dist/bin.js', 'bogus'], { cwd: pkgDir, encoding: 'utf8' });
    expect(r.status).toBe(2);
  });
});
