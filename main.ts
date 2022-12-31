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

	renameFile(oldPath: string, newPath: string) {
		return fs.rename(oldPath, newPath, () => console.log('renamed file', oldPath, newPath));
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

	isFileExportable(path: string) {
		return isExportable(path, this.readFile)
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
			if(this.isFileExportable(oldPath)) {
				modifyTitle(
					oldPath, 
					e.name, 
					// @ts-ignore
					e.basename,
					this.readFile,
					this.renameFile,
					this.writeFile,
				);
			}
    }));

		this.registerEvent(this.app.vault.on('modify', async (e) => {
			if(this.isFileExportable(e.path)) {
				const content = this.readFile(e.path);
				const hugoPath = this.settings.hugoExportDir.split('/').last()

				let updatedContent = processInternalLinks(content, (link) => {
					return transformObsidianLink(link, (title) => `/${hugoPath}/${slugify(title)}`)
				});

				// @ts-ignore
				updatedContent = appendHugoTitle(content, e.basename);
				this.writeFile(e.path, updatedContent);
			} else {
				if(this.fileExists(`${this.settings.hugoExportDir}/${e.name}`)) {
					handleDelete(`${this.settings.hugoExportDir}/${e.name}`, this.deleteFile);
				}
			}
    }));

		this.registerEvent(this.app.vault.on('delete', async (e) => {
			handleDelete(`${this.settings.hugoExportDir}/${e.name}`, this.deleteFile);
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
