import isExportable from "./is-exportable";

test('should export if has frontmatter', () => {
  expect(isExportable(`---\ntitle: This is exportable\n---\n`)).toBe(true);
});

test('should not export if has incomplete frontmatter', () => {
  expect(isExportable(`this should not export`)).toBe(false);
  expect(isExportable(`---\nthis should not export`)).toBe(false);
  expect(isExportable(`---\nthis should not export\n---`)).toBe(false);
});