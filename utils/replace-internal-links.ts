import slugify from "./slugify";

function replaceInternalLinks(content: string) {
	/**
	 * for each instance of "[[Note Name]]"", we'll replace it with "[Note Name](/posts/note-name)"
	 * 
	 * this means we will take the text in-between the `[[X]]`, sluggify X, 
	 * and create a markdown link in the format [X](`/posts/slugify(X)`)
	 */
	return content.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
		if(p1.includes('|')) {
			const p = p1.split('|');
			return `[${p[1]}](/posts/${slugify(p[0])})`	
		} else {
			return `[${p1}](/posts/${slugify(p1)})`
		}
	});
}

export default replaceInternalLinks