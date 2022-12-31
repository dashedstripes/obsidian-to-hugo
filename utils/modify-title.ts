	async function modifyTitle(
		oldPath: string,
		newPath: string,
		newTitle: string,
		readFile: (path: string) => string,
		updateFile: (oldPath: string, newPath: string) => void,
		writeFile: (path: string, content: string) => void
	) {
		const text = readFile(oldPath);

		try {
			updateFile(oldPath, newPath)
		} catch (err) {
			console.error(err);
		}

		// after renaming, we need to change the hugo title
		const content = text.split('\n');
		content.splice(1, 1, `title: ${newTitle}`);
		const newText = content.join('\n');

		try {
			writeFile(newPath, newText)
		} catch (err) {
			console.error(err);
		}
	}

  export default modifyTitle;