import handleDelete from "./handle-delete";

test('should delete from fs', () => {
  let fakeFs: { [key: string]: string } = {
    '/notes/to-delete.md': '---\ntitle: to be deleted\n---'
  }

  handleDelete('/notes/to-delete.md', (path: string) => delete fakeFs[path])

  expect(fakeFs['/notes/to-delete.md']).toBeUndefined();
})