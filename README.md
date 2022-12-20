# Obsidian to Hugo

An Obsidian Plugin to export notes to Hugo.

## Motivation

My website is built using Hugo, however I do the majority of my writing in Obsidian. I wanted a way to easily export content from Obsidian to Hugo, whilst keeping my writing flow elegant, and not having to manually deal with any of the Hugo quirks.

## Usage

There is one setting for this plugin:

- `Hugo Directory`

The `Hugo Directory` is where you'd like to generate the markdown files. This is likely to be your `posts` folder in the Hugo file structure.

The tool knows to export your content if your note begins with hugo frontmatter. For example:

```markdown
This content will not be exported.
```

```markdown
---
title: My Title
---

This content *will* be exported.
```
