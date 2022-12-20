import * as fs from 'fs';
import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// TODO: find a way of parsing internal obsidian links to urls in hugo

interface ExportToHugoSettings {
	hugoDir: string;
	exportFlag: string;
}

const DEFAULT_SETTINGS: ExportToHugoSettings = {
	hugoDir: '/',
	exportFlag: '~export'
}

function slugify(text: string) {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

function getCurrentDate(): string {
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	const yyyy = today.getFullYear();

	return `${yyyy}-${mm}-${dd}`;
}

export default class ExportToHugo extends Plugin {
	settings: ExportToHugoSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));

		// this gets called on save
		this.registerEvent(this.app.vault.on('modify', async (e) => {
			this.onModify(e.name);
    }));

		this.registerEvent(this.app.vault.on('delete', async (e) => {
			this.onDelete(e.name);
    }));
	}

	onunload() {

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
		// 1. get the contents of the current note
		const currentNote = this.app.workspace.getActiveFile();
		if(!currentNote) return; // Nothing Open

		let text = await this.app.vault.read(currentNote);

		// 2. create a copy of this node in the hugo directory

		if(text.substring(0, this.settings.exportFlag.length) === this.settings.exportFlag) {
			
			let content = text.split('\n');
			content = content.slice(2);

			let noteTitle = currentNoteName.split('.')[0];

			let newText = content.join('\n');

			newText = 
`---
title: ${noteTitle}
publishdate: ${getCurrentDate()}
---

` + newText;

			try {
				fs.writeFileSync(`${this.settings.hugoDir}/${slugify(noteTitle)}.md`, newText);
			} catch (err) {
				console.error(err);
			}
		}
	}

	shouldSaveFile(): boolean {
		return false;
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

		new Setting(containerEl)
			.setName('Export Flag')
			.setDesc('What keyword would you like to use as your export flag?')
			.addText(text => text
				.setPlaceholder('~export')
				.setValue(this.plugin.settings.exportFlag)
				.onChange(async (value) => {
					this.plugin.settings.exportFlag = value;
					await this.plugin.saveSettings();
				}));
	}
}
