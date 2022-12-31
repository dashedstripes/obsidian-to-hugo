function transformObsidianLink(link: string, callback: (title: string) => string) {
	if(link.includes('|')) {
		const p = link.split('|');
		return `[${p[1]}](${callback(p[0])})`
	} else {
		return `[${link}](${callback(link)})`
	}
}

function processInternalLinks(content: string, callback: (link: string) => string) {
	return content.replace(/\[\[(.*?)\]\]/g, (match, p1) => callback(p1));
}

export {
  processInternalLinks,
  transformObsidianLink
}