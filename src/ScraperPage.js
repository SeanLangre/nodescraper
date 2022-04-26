
import puppeteer from 'puppeteer';

export default class ScraperPage {

	constructor() {
	}

	async GeneratePage() {
		const browser = await puppeteer.launch({
			headless: false
		});
		return await browser.newPage();
	}
}