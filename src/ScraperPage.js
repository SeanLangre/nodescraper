
import puppeteer from 'puppeteer';

export default class ScraperPage {

	constructor() {
	}

	async GeneratePage() {
		const browser = await puppeteer.launch({
			headless: true,
			userDataDir: './src/localStorage'
		});
		return await browser.newPage();
	}
}