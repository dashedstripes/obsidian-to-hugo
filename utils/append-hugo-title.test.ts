import appendHugoTitle from "./append-hugo-title";

test('should append a title to some content', () => {
  const content = `---\npublishdate: 2022-12-31\n---\n`;
  const expected = `---\ntitle: Hello World\npublishdate: 2022-12-31\n---\n`;

  expect(appendHugoTitle(content, 'Hello World')).toBe(expected);
})