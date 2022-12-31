function generateHugoMetadata(metadata: { [key: string]: string }) {
  let data = '';

  const props = Object.keys(metadata);

  for(let i = 0; i < props.length; i++) {
    data += `${props[i]}: ${metadata[props[i]]}\n`
  }
  
  return `---\n${data}---\n\n`
}

function addHugoMetadata(text: string, hugoMetadata: { [key: string]: string }) {
  if(!text || !hugoMetadata) {
    return null;
  }

  return generateHugoMetadata(hugoMetadata) + text;
}

export default addHugoMetadata;