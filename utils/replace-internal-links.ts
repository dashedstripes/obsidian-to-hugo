import slugify from "./slugify";

function replaceInternalLinks(content: string) {
	/**
	 * for each instance of "[[Note Name]]"", we'll replace it with "[Note Name](/posts/note-name)"
	 * 
	 * this means we will take the text in-between the `[[X]]`, sluggify X, 
	 * and create a markdown link in the format [X](`/posts/slugify(X)`)
	 */
	return content.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
		return `[${p1}](/posts/${slugify(p1)})`
	});
}

export default replaceInternalLinks