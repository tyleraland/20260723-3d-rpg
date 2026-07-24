import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';

const MB = 1024 * 1024;
const MAX_FILE_BYTES = 10 * MB;
const WARN_TOTAL_BYTES = 150 * MB;
const FAIL_TOTAL_BYTES = 900 * MB;

const output = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' }
);
const files = output.split('\0').filter(Boolean);

let totalBytes = 0;
const oversized: string[] = [];

for (const file of files) {
  const bytes = statSync(resolve(file)).size;
  totalBytes += bytes;
  if (bytes > MAX_FILE_BYTES) oversized.push(`${file} (${(bytes / MB).toFixed(1)} MB)`);
}

if (oversized.length) {
  console.error('Files over the 10 MB repository limit:');
  console.error(oversized.map((file) => `  - ${file}`).join('\n'));
  process.exit(1);
}

const totalMB = totalBytes / MB;
if (totalBytes > FAIL_TOTAL_BYTES) {
  console.error(`Repository content is ${totalMB.toFixed(1)} MB; the limit is 900 MB.`);
  process.exit(1);
}

if (totalBytes > WARN_TOTAL_BYTES) {
  console.warn(`Warning: repository content is ${totalMB.toFixed(1)} MB (target: under 150 MB).`);
} else {
  console.log(
    `Repository size check passed: ${totalMB.toFixed(1)} MB across ${files.length} files.`
  );
}
