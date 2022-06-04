
import puppeteer from 'puppeteer';

export default class ScraperPage {

	constructor() {
		this.browser
	}

	async GeneratePage(headless = true, devtools = false) {
		
		this.browser = await puppeteer.launch({
			headless: headless,
			// userDataDir: './src/localStorage',
			userDataDir: 'D:/WORK-RESEARCH/JavaScript/NodeScraper/src/localStorage',
			devtools: devtools,
			args: ['--no-sandbox'],
			product: "firefox"
		});
		return await this.browser.newPage();
	}

	async CloseBrowser() {
		return await this.browser.close();
	}

}