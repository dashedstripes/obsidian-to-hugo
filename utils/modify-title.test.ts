import modifyTitle from "./modify-title";

test('should modify title', () => {
  const ans = modifyTitle(
    `---\ntitle: old title\n---\n`,
    'New Title'
  );

  expect(ans).toBe(`---\ntitle: New Title\n---\n`)
})

test('should modify title, but leave rest of metadata along', () => {
  const ans = modifyTitle(
    `---\ntitle: old title\npublishdate: 2023-01-02---\n`,
    'New Title'
  );

  expect(ans).toBe(`---\ntitle: New Title\npublishdate: 2023-01-02---\n`,)
})