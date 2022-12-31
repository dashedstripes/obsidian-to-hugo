import modifyTitle from "./modify-title";

test('should modify title', () => {
  let fakeFS: { [key: string]: string } = {
    '/notes/my-note.md': `---\ntitle: My Note\n---`
  };

  const updateFile = (oldPath: string, newPath: string) => {
    fakeFS[newPath] = fakeFS[oldPath];
    delete fakeFS[oldPath];
  };

  const writeFile = (path: string, content: string) => {
    fakeFS[path] = content;
  };

  modifyTitle(
    fakeFS['/notes/my-note.md'],
    true,
    '/notes/my-note.md',
    '/notes/my-updated-note.md',
    'My Updated Note',
    updateFile,
    writeFile
  )

  expect(fakeFS['/notes/my-note.md']).toBeUndefined();
  expect(fakeFS['/notes/my-updated-note.md']).toBe(`---\ntitle: My Updated Note\n---`);
})