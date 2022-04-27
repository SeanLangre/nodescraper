
import puppeteer from 'puppeteer';

export default class ScraperPage {

	constructor() {
	}

	async GeneratePage() {
		const browser = await puppeteer.launch({
			headless: false,
			userDataDir: './src/localStorage',
			devtools: true
		});
		return await browser.newPage();
	}

	async CloseBrowser() {
		return await browser.close();
	}

}