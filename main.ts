import * as fs from 'fs';
import { App, Plugin, PluginSettingTab, Setting, Notice } from 'obsidian';
import addHugoMetadata from 'utils/add-hugo-metadata';
import getTodayDate from 'utils/get-today-date';
import handleDelete from 'utils/handle-delete';
import isExportable from 'utils/is-exportable';
import modifyTitle from 'utils/modify-title';
import replaceInternalLinks from 'utils/replace-internal-links';
import slugify from 'utils/slugify';

interface ExportToHugoSettings {
	hugoExportDir: string;
}

const DEFAULT_SETTINGS: ExportToHugoSettings = {
	hugoExportDir: '/',
}

export default class ExportToHugo extends Plugin {
	settings: ExportToHugoSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item
            .setTitle("Add Hugo Metadata")
            .setIcon("document")
            .onClick(async () => {
							const data = addHugoMetadata(view.data, { publishdate: getTodayDate() });
							if(data) {
								editor.setValue(data);
							}
            });
        });
      })
    );

		this.registerEvent(this.app.vault.on('rename', async (e, oldName) => {
			const oldNoteTitle = oldName.split('.')[0];
			const newNoteTitle = e.name.split('.')[0];

			const currentNote = this.app.workspace.getActiveFile();
			if(!currentNote) return;

			const text = await this.app.vault.read(currentNote);

			const updateFile = (oldPath: string, newPath: string) => fs.rename(oldPath, newPath, () => console.log('renamed file', oldPath, newPath));
			const writeFile = (path: string, content: string) => fs.writeFileSync(path, content);

			modifyTitle(
				text, 
				isExportable(text),
				`${this.settings.hugoExportDir}/${slugify(oldNoteTitle)}.md`,
				`${this.settings.hugoExportDir}/${slugify(newNoteTitle)}.md`,
				newNoteTitle, 
				updateFile, 
				writeFile
			);
    }));

		this.registerEvent(this.app.vault.on('modify', async (e) => {
			this.onModify(e.name);
    }));

		this.registerEvent(this.app.vault.on('delete', async (e) => {
			let noteTitle = e.name.split('.')[0];
			const path = `${this.settings.hugoExportDir}/${slugify(noteTitle)}.md`;
			const deleteFile = (path: string) => fs.unlinkSync(path);

			handleDelete(path, deleteFile);
    }));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// TODO: test this
	async onModify(currentNoteName: string) {
		const currentNote = this.app.workspace.getActiveFile();
		if(!currentNote) return;

		const title = currentNoteName.split('.')[0]
		let text = await this.app.vault.read(currentNote);

		// if first characters aren't hugo frontmatter, we won't export this note
		if(!isExportable(text)) {
			// let's delete the file if it exists
			try {
				if (fs.existsSync(`${this.settings.hugoExportDir}/${slugify(title)}.md`)) {
					handleDelete(
						`${this.settings.hugoExportDir}/${slugify(title)}.md`, 
						(path: string) => fs.unlinkSync(path)
					);
				}
			} catch(err) {
				console.error(err)
			}

			return;
		}

		const content = text.split('\n');
		// we're going to append the obsidian title as the first element in our frontmatter
		content.splice(1, 0, `title: ${title}`);
		
		const splitPath = this.settings.hugoExportDir.split('/');
		const newText = replaceInternalLinks(content.join('\n'), splitPath[splitPath.length - 1]);

		try {
			fs.writeFileSync(`${this.settings.hugoExportDir}/${slugify(title)}.md`, newText);
		} catch (err) {
			console.error(err);
		}
	}
}

class SettingTab extends PluginSettingTab {
	plugin: ExportToHugo;

	constructor(app: App, plugin: ExportToHugo) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Hugo Export.'});

		new Setting(containerEl)
			.setName('Hugo Export Directory')
			.setDesc('Where would you like to save your files?')
			.addText(text => text
				.setPlaceholder('/Users/Library/etc')
				.setValue(this.plugin.settings.hugoExportDir)
				.onChange(async (value) => {
					this.plugin.settings.hugoExportDir = value;
					await this.plugin.saveSettings();
				}));

	}
}
