import { addIcon, App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { DEFAULT_SETTINGS, HeadingShifterSettings } from "settings";
import {
	createDecreaseHeadingCommand,
	createIncreaseHeadingCommand,
} from "features/shiftHeading";
import { createApplyHeadingCommand } from "features/applyHeading";
import {
	icon_decrease_heading,
	icon_heading_0,
	icon_heading_1,
	icon_heading_2,
	icon_heading_3,
	icon_heading_4,
	icon_heading_5,
	icon_heading_6,
	icon_increase_heading,
} from "ui/icon";

const HEADINGS = [0, 1, 2, 3, 4, 5, 6];

export default class HeadingShifter extends Plugin {
	settings: HeadingShifterSettings;

	async onload() {
		// Loading
		await this.loadSettings();

		// Command
		HEADINGS.forEach((heading) =>
			this.addCommand(createApplyHeadingCommand(this.settings, heading))
		);
		this.addCommand(createIncreaseHeadingCommand(this.settings));
		this.addCommand(createDecreaseHeadingCommand(this.settings));

		// Setting
		this.addSettingTab(new HeadingShifterSettingTab(this.app, this));

		addIcon("headingShifter_decreaseIcon", icon_decrease_heading);
		addIcon("headingShifter_increaseIcon", icon_increase_heading);
		addIcon("headingShifter_heading0", icon_heading_0);
		addIcon("headingShifter_heading1", icon_heading_1);
		addIcon("headingShifter_heading2", icon_heading_2);
		addIcon("headingShifter_heading3", icon_heading_3);
		addIcon("headingShifter_heading4", icon_heading_4);
		addIcon("headingShifter_heading5", icon_heading_5);
		addIcon("headingShifter_heading6", icon_heading_6);

		this.addRibbonIcon("headingShifter_increaseIcon", "increase", () => {});
		this.addRibbonIcon("headingShifter_decreaseIcon", "decrease", () => {});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class HeadingShifterSettingTab extends PluginSettingTab {
	plugin: HeadingShifter;

	constructor(app: App, plugin: HeadingShifter) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Lower limit of Heading")
			.setDesc(
				"The lower Heading Size that will be decreased by the Heading Shift "
			)
			.addDropdown((dropdown) => {
				// Create options from heading array like {'0':'0','1':'1',.......}
				const headingOptions: Record<string, string> = HEADINGS.reduce(
					(prev, heading) => {
						return { ...prev, [heading]: String(heading) };
					},
					{}
				);

				dropdown
					.addOptions(headingOptions)
					.setValue(String(this.plugin.settings.limitHeadingFrom))
					.onChange(async (value) => {
						this.plugin.settings.limitHeadingFrom = Number(value);
						await this.plugin.saveSettings();
					});
			});
	}
}
