import addHugoMetadata from "./add-hugo-metadata";

test('should pass base case', () => {
  const expected = `---\npublishdate: 2022-12-30\n---\nhey world`;
  expect(addHugoMetadata('hey world', { publishdate: '2022-12-30' })).toBe(expected);
});