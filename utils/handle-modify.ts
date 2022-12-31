async function handleModify(
  path: string,
  content: string,
) {
  
}

// async function handleModify(
//   title: string
// ) {
//   const currentNote = this.app.workspace.getActiveFile();
//   if(!currentNote) return;

//   const title = currentNoteName.split('.')[0]
//   let text = await this.app.vault.read(currentNote);

//   // if first characters aren't hugo frontmatter, we won't export this note
//   if(!isExportable(text)) {
//     // let's delete the file if it exists
//     try {
//       if (fs.existsSync(`${this.settings.hugoExportDir}/${slugify(title)}.md`)) {
//         handleDelete(
//           `${this.settings.hugoExportDir}/${slugify(title)}.md`, 
//           (path: string) => fs.unlinkSync(path)
//         );
//       }
//     } catch(err) {
//       console.error(err)
//     }

//     return;
//   }

//   const content = text.split('\n');
//   // we're going to append the obsidian title as the first element in our frontmatter
//   content.splice(1, 0, `title: ${title}`);
  
//   const splitPath = this.settings.hugoExportDir.split('/');
//   const newText = replaceInternalLinks(content.join('\n'), splitPath[splitPath.length - 1]);

//   try {
//     fs.writeFileSync(`${this.settings.hugoExportDir}/${slugify(title)}.md`, newText);
//   } catch (err) {
//     console.error(err);
//   }
// }

export default handleModify;