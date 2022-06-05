
import puppeteer from 'puppeteer';

export default class ScraperPage {

	constructor() {
		this.browser
	}

	async GetBrowser(headless = true, devtools = false) {
		this.browser = await puppeteer.launch({
			headless: headless,
			// userDataDir: './src/localStorage',
			userDataDir: 'D:/WORK-RESEARCH/JavaScript/NodeScraper/src/localStorage',
			devtools: devtools,
			args: ['--no-sandbox'],
			product: "firefox"
		});
		return this.browser
	}

}