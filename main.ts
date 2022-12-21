import * as fs from 'fs';
import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import isExportable from 'utils/is-exportable';
import replaceInternalLinks from 'utils/replace-internal-links';
import slugify from 'utils/slugify';

interface ExportToHugoSettings {
	hugoDir: string;
}

const DEFAULT_SETTINGS: ExportToHugoSettings = {
	hugoDir: '/',
}

export default class ExportToHugo extends Plugin {
	settings: ExportToHugoSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingTab(this.app, this));

		this.registerEvent(this.app.vault.on('modify', async (e) => {
			this.onModify(e.name);
    }));

		this.registerEvent(this.app.vault.on('delete', async (e) => {
			this.onDelete(e.name);
    }));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onDelete(currentNoteName: string) {
		let noteTitle = currentNoteName.split('.')[0];
		try {
			fs.unlinkSync(`${this.settings.hugoDir}/${slugify(noteTitle)}.md`)
		} catch(err) {
			console.error(err)
		}
	}

	async onModify(currentNoteName: string) {
		const currentNote = this.app.workspace.getActiveFile();
		if(!currentNote) return;

		const title = currentNoteName.split('.')[0]
		let text = await this.app.vault.read(currentNote);

		// if first characters aren't hugo frontmatter, we won't export this note
		if(!isExportable(text)) {
			// let's delete the file if it exists
			try {
				if (fs.existsSync(`${this.settings.hugoDir}/${slugify(title)}.md`)) {
					this.onDelete(currentNoteName);
				}
			} catch(err) {
				console.error(err)
			}

			return;
		}

		const content = text.split('\n');

		// we're going to append the obsidian title as the first element in our frontmatter
		content.splice(1, 0, `title: ${title}`);

		const newText = replaceInternalLinks(content.join('\n'));

		try {
			fs.writeFileSync(`${this.settings.hugoDir}/${slugify(title)}.md`, newText);
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
			.setName('Hugo Directory')
			.setDesc('Where would you like generated files to go?')
			.addText(text => text
				.setPlaceholder('/Users/Library/etc')
				.setValue(this.plugin.settings.hugoDir)
				.onChange(async (value) => {
					this.plugin.settings.hugoDir = value;
					await this.plugin.saveSettings();
				}));

	}
}
