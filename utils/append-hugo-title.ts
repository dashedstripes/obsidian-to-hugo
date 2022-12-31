function appendHugoTitle(content: string, title: string) {
  const splitContent = content.split('\n');
  splitContent.splice(1, 0, `title: ${title}`);
  content = splitContent.join('\n');
  return content;
}

export default appendHugoTitle;