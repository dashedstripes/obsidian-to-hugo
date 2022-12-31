	function modifyTitle(
		text: string,
		newTitle: string,
	) {
		const content = text.split('\n');
		content.splice(1, 1, `title: ${newTitle}`);
		return content.join('\n');
	}

  export default modifyTitle;