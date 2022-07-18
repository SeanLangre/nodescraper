
// import puppeteer from 'puppeteer';

export default class ScraperPage {

	constructor() {
		// this.browser
	}

	async GeneratePage(browser) {
		
		// this.browser = await puppeteer.launch({
		// 	headless: headless,
		// 	// userDataDir: './src/localStorage',
		// 	userDataDir: 'D:/WORK-RESEARCH/JavaScript/NodeScraper/src/localStorage',
		// 	devtools: devtools,
		// 	args: ['--no-sandbox'],
		// 	product: "firefox"
		// });
		return await browser.newPage();
	}

	// async CloseBrowser() {
	// 	return await this.browser.close();
	// }

}