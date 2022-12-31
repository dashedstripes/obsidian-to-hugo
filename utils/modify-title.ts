	async function modifyTitle(
		currentNoteText: string, 
		shouldExport: boolean,
    oldPath: string, 
    newPath: string,
		newNoteTitle: string,
		updateFile: (oldPath: string, newPath: string) => void,
		writeFile: (path: string, content: string) => void
	) {
		if(shouldExport) {

			try {
				updateFile(oldPath, newPath)
			} catch (err) {
				console.error(err);
			}

			// after renaming, we need to change the hugo title
			const content = currentNoteText.split('\n');
			content.splice(1, 1, `title: ${newNoteTitle}`);
			const newText = content.join('\n');

			try {
				writeFile(newPath, newText)
			} catch (err) {
				console.error(err);
			}
		}
	}

  export default modifyTitle;