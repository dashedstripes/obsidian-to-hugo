import handleModify from "./handle-modify";

let fakeFS = {
  '/notes/my-note': '---\ntitle: my note\n---\n some content'
}

test('should modify contents', () => {
  handleModify(
    '/notes/my-note',
    '---\ntitle: my note\n---\n some new content'
  )
});