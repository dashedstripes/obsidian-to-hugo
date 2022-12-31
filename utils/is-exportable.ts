function isExportable(text: string) {
  // we want to check that frontmatter has been created properly, not just the first line
  // if the first line isn't ---, return early;
  if(text.substring(0, 3) !== '---') {
    return false;
  }

  // first line is the frontmatter opening, so split the rest of the doc into lines
  const content = text.split('\n');

  for(let i = 1; i < content.length; i++) {
    if(content[i] === '---' && content[i+1] === '') {
      return true;
    }
  }

  return false;
}

export default isExportable;