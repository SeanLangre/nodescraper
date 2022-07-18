
export default class ScraperPage {

	constructor() {
	}

	async GeneratePage(browser) {
		return await browser.newPage();
	}
}