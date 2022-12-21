import replaceInternalLinks from "./replace-internal-links";

test('should pass base case', () => {
  expect(replaceInternalLinks("hello [[world]]")).toBe("hello [world](/posts/world)");
});

test('should replace multiple links', () => {
  expect(
		replaceInternalLinks(`this is a [[test]]. it has [[multiple links]] [[some other lines]] and also some [[other lines]]`))
		.toBe(`this is a [test](/posts/test). it has [multiple links](/posts/multiple-links) [some other lines](/posts/some-other-lines) and also some [other lines](/posts/other-lines)`);
});

test('should return original string if no links are found', () => {
  expect(replaceInternalLinks("")).toBe("");
	expect(replaceInternalLinks("no links here")).toBe("no links here");
});

// I was going to write some test cases for symbols, but those are covered by slugify.