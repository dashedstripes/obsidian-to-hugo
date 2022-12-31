import * as fs from 'fs';
import { App, Plugin, PluginSettingTab, Setting, Notice } from 'obsidian';
import addHugoMetadata from 'utils/add-hugo-metadata';
import appendHugoTitle from 'utils/append-hugo-title';
import getTodayDate from 'utils/get-today-date';
import handleDelete from 'utils/handle-delete';
import isExportable from 'utils/is-exportable';
import modifyTitle from 'utils/modify-title';
import { processInternalLinks, transformObsidianLink } from 'utils/process-internal-links';
import slugify from 'utils/slugify';

interface ExportToHugoSettings {
	hugoExportDir: string;
}

const DEFAULT_SETTINGS: ExportToHugoSettings = {
	hugoExportDir: '/',
}

export default class ExportToHugo extends Plugin {
	settings: ExportToHugoSettings;

	readFile(path: string) {
		return fs.readFileSync(path, 'utf-8')
	} 

	async readActiveFile() {
		const currentNote = this.app.workspace.getActiveFile();
		if(!currentNote) return;
		return await this.app.vault.read(currentNote);
	}

	renameFile(oldPath: string, newPath: string, callback: () => void) {
		return fs.rename(oldPath, newPath, callback);
	}

	writeFile(path: string, content: string) {
		return fs.writeFileSync(path, content);
	}

	deleteFile(path: string) {
	  return fs.unlinkSync(path);	
	}

	fileExists(path: string) {
		return fs.existsSync(path);
	}

	isLocalFileExportable(path: string) {
		const text = this.readFile(path);
		return isExportable(text);
	}

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

		this.registerEvent(this.app.vault.on('rename', async (e, oldPath) => {
			const text = await this.readActiveFile() || '';
			const oldTitle = oldPath.split('.')[0];
			const newTitle = e.name.split('.')[0]

			if(isExportable(text)) {
				const content = modifyTitle(text, e.name.split('.')[0]);
	
				this.renameFile(
					`${this.settings.hugoExportDir}/${slugify(oldTitle)}.md`,
					`${this.settings.hugoExportDir}/${slugify(newTitle)}.md`,
					() => {
						this.writeFile(
							`${this.settings.hugoExportDir}/${slugify(newTitle)}.md`,
							content
						);
					}
				)
			}
			
    }));

		this.registerEvent(this.app.vault.on('modify', async (e: any) => {
			const text = await this.readActiveFile() || '';

			if(isExportable(text)) {
				const hugoPath = this.settings.hugoExportDir.split('/').last()

				let updatedContent = processInternalLinks(text, (link) => {
					return transformObsidianLink(link, (title) => `/${hugoPath}/${slugify(title)}`)
				});

				// @ts-ignore
				updatedContent = appendHugoTitle(updatedContent, e.basename);
				this.writeFile(`${this.settings.hugoExportDir}/${slugify(e.basename)}.md`, updatedContent);
			} else {
				if(this.fileExists(`${this.settings.hugoExportDir}/${slugify(e.basename)}.md`)) {
					handleDelete(`${this.settings.hugoExportDir}/${slugify(e.basename)}.md`, this.deleteFile);
				}
			}
    }));

		this.registerEvent(this.app.vault.on('delete', async (e: any) => {
			handleDelete(`${this.settings.hugoExportDir}/${slugify(e.basename)}.md`, this.deleteFile);
    }));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
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
