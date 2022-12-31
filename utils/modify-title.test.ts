import modifyTitle from "./modify-title";

let fakeFS: { [key: string]: string } = {
  '/notes/old-note.md': `---\ntitle: Old Note\n---\n`
};

const readFile = (path: string) => fakeFS[path];

const updateFile = (oldPath: string, newPath: string) => {
  fakeFS[newPath] = fakeFS[oldPath];
  delete fakeFS[oldPath];
};

const writeFile = (path: string, content: string) => {
  fakeFS[path] = content;
};

test('should modify title', () => {
  modifyTitle(
    '/notes/old-note.md',
    '/notes/updated-note.md',
    'Updated Note',
    readFile,
    updateFile,
    writeFile
  )

  expect(fakeFS['/notes/old-note.md']).toBeUndefined();
  expect(fakeFS['/notes/updated-note.md']).toBe(`---\ntitle: Updated Note\n---\n`);
})