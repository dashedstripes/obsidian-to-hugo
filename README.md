# Obsidian to Hugo

An Obsidian Plugin to export notes to Hugo.

## Motivation

My website is built using Hugo, however I do the majority of my writing in Obsidian. I wanted a way to easily export content from Obsidian to Hugo, whilst keeping my writing flow elegant, and not having to manually deal with any of the Hugo quirks.

## Usage

There are two settings for this plugin:

- `Hugo Directory`
- `Export Flag`

The `Hugo Directory` is where you'd like to generate the markdown files. This is likely to be your `posts` folder in the Hugo file structure.

To flag your content as exportable, use whatever you defined as `Export Flag` as the very first text in your Obsidian note.

For example, imagine you've set your `Export Flag` to `~export`.


```markdown
This content will not be exported.
```

```markdown
~export

This content *will* be exported.
```

If you're having any trouble, ensure that the very first text in your note matches your export flag, and that you also have a new line **after** your export flag.

## Additional Information

The tool slugifies your obsidian note title to form the URL for the post. It also generates basic hugo frontmatter that uses the obsidian note title.
