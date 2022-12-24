import isExportable from "./is-exportable";

test('should export if has frontmatter', () => {
  expect(isExportable(`---
publishdate: 2022-12-20
---`)).toBe(true);
});

test('should not export if incomplete frontmatter', () => {
  expect(isExportable("---")).toBe(false);
  expect(isExportable(`---
publishdate: 2022-12-20
`)).toBe(false);
});

test('should export even if no frontmatter attributes added', () => {
  expect(isExportable(`---
---`)).toBe(true)
})