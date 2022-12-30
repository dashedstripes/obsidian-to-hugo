import addHugoMetadata from "./add-hugo-metadata";

test('should pass base case', () => {
  const expected = 
`---
publishdate: 2022-12-30
---

hey world`;

  expect(addHugoMetadata('hey world', {
    publishdate: '2022-12-30'
  })).toBe(expected);
});