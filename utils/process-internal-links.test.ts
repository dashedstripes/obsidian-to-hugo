import { processInternalLinks, transformObsidianLink } from "./process-internal-links";

test('should transform strings based on callback fn', () => {
  expect(transformObsidianLink('hello', (link) => {
    return `/${link}`;
  })).toBe(`[hello](/hello)`)

  expect(transformObsidianLink('world', (link) => {
    return `/hello/${link}`;
  })).toBe(`[world](/hello/world)`)
})

test('should call function for every internal obsidian link', () => {
  processInternalLinks(`hello [[world]]`, (link) => {
    expect(link).toBe('world')
    return link;
  })

  processInternalLinks(`hello [[world|everyone]]`, (link) => {
    expect(link).toBe('world|everyone')
    return link;
  })
})

test('should transform all internal links to hugo links, given a callback', () => {
  processInternalLinks('hello [[world]]', (link) => {
    const ans = transformObsidianLink(link, (title) => {
      return `/${title}`
    })

    expect(ans).toBe('[world](/world)')
    return link;
  })
})