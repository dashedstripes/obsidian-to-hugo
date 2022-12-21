import slugify from "./slugify";

test('should do base case', () => {
  expect(slugify("hello world")).toBe("hello-world");
});

test('should remove periods', () => {
  expect(slugify("hello.world")).toBe("helloworld");
});

test('should convert spaces to hyphens', () => {
  expect(slugify("hello      world")).toBe("hello------world");
});

test('should strip all symbols', () => {
  expect(slugify(`!@#$%^&*(){}:"<>?[];',./`)).toBe(``);
});

test('should convert caps to lowercase', () => {
  expect(slugify(`ABC`)).toBe(`abc`);
});

