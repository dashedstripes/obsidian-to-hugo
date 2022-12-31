import isExportable from "./is-exportable";

const fs: { [key: string]: string } = {
  'yes-export-1.md': `---\ntitle: This is exportable\n---\n`,
  'no-export-1.md': `this should not export`,
  'no-export-2.md': `---\nthis should not export`,
  'no-export-3.md': `---\nthis should not export\n---`
}

const readFile = (path: string) => fs[path];

test('should export if has frontmatter', () => {
  expect(isExportable('yes-export-1.md', readFile)).toBe(true);
});

test('should not export if has incomplete frontmatter', () => {
  expect(isExportable('no-export-1.md', readFile)).toBe(false);
  expect(isExportable('no-export-2.md', readFile)).toBe(false);
  expect(isExportable('no-export-3.md', readFile)).toBe(false);
});