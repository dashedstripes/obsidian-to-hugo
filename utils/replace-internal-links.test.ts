import replaceInternalLinks from "./replace-internal-links";

test('should pass base case', () => {
  expect(replaceInternalLinks("hello [[world]]", 'posts')).toBe("hello [world](/posts/world)");
});

test('should use path parameter to create url', () => {
  expect(replaceInternalLinks("[[hello]]", 'notes')).toBe("[hello](/notes/hello)");
  expect(replaceInternalLinks("[[hello]]", 'blog')).toBe("[hello](/blog/hello)");
})

test('path parameter should not start with /', () => {
  expect(() => replaceInternalLinks("[[hello]]", "/posts")).toThrow('path cannot start with /');
})

test('should replace multiple links', () => {
  expect(
		replaceInternalLinks(`this is a [[test]]. it has [[multiple links]] [[some other lines]] and also some [[other lines]]`, 'posts'))
		.toBe(`this is a [test](/posts/test). it has [multiple links](/posts/multiple-links) [some other lines](/posts/some-other-lines) and also some [other lines](/posts/other-lines)`);
});

test('should return original string if no links are found', () => {
  expect(replaceInternalLinks("", 'posts')).toBe("");
	expect(replaceInternalLinks("no links here", 'posts')).toBe("no links here");
});

test('should convert internal links with aliases', () => {
  expect(replaceInternalLinks(`[[test|altered name]]`, 'posts')).toBe(`[altered name](/posts/test)`)
  expect(replaceInternalLinks(`[[hello world|changed name]]`, 'posts')).toBe(`[changed name](/posts/hello-world)`)
  expect(replaceInternalLinks(`[[hello world | changed name]]`, 'posts')).toBe(`[ changed name](/posts/hello-world-)`)
})

// I was going to write some test cases for symbols, but those are covered by slugify.