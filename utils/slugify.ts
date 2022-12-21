function slugify(text: string) {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export default slugify;