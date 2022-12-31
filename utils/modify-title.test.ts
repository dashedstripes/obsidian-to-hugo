import modifyTitle from "./modify-title";

test('should modify title', () => {
  const ans = modifyTitle(
    `---\ntitle: old title\n---\n`,
    'New Title'
  );

  expect(ans).toBe(`---\ntitle: New Title\n---\n`)
})