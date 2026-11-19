// SPDX-License-Identifier: MIT
import { readFileSync } from 'node:fs';

export interface Io {
  stdout(text: string): void;
  stderr(text: string): void;
}

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  homepage: string;
}

// package.json is the single source of truth for name, version and URLs.
// Resolves to <pkg>/package.json from both src/ (tests) and dist/ (published).
function readPackageInfo(): PackageInfo {
  const raw = readFileSync(new URL('../package.json', import.meta.url), 'utf8');
  return JSON.parse(raw) as PackageInfo;
}

function helpText(pkg: PackageInfo): string {
  const repoUrl = pkg.homepage.replace(/#.*$/, '');
  return `${pkg.name} ${pkg.version}
${pkg.description}

Status: early development — not ready for use yet.

Usage:
  ${pkg.name} [options]

Options:
  -h, --help     Show this help
  -v, --version  Print the version

${repoUrl}
`;
}

export function run(argv: readonly string[], io: Io): number {
  const pkg = readPackageInfo();
  const [arg, ...rest] = argv;

  if (rest.length > 0) {
    return unknownArgument(pkg, rest[0]!, io);
  }

  switch (arg) {
    case undefined:
    case '-h':
    case '--help':
      io.stdout(helpText(pkg));
      return 0;
    case '-v':
    case '--version':
      io.stdout(`${pkg.version}\n`);
      return 0;
    default:
      return unknownArgument(pkg, arg, io);
  }
}

function unknownArgument(pkg: PackageInfo, arg: string, io: Io): number {
  io.stderr(`${pkg.name}: unknown argument '${arg}'\nRun '${pkg.name} --help' for usage.\n`);
  return 2;
}
