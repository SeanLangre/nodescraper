import ScraperUtils from './ScraperUtils.js'
import 'dotenv/config'

export default class ScraperLogin {

	constructor(page) {
		this.page = page
	}

	getURL() {
		return `https://www.tradera.com/login`;
	}

	async Login() {
		ScraperUtils.PrintScrape("LOGIN");

		var page = this.page
		let url = this.getURL();
		console.log(url)
		await page.goto(url);
		await page.waitForTimeout(2000)
		await ScraperUtils.removeGDPRPopup(page)
		await page.waitForTimeout(2000)

		try {
			await page.type("input[type=text]", process.env.TRADERA_USERNAME);
			await page.type("input[type=password]", process.env.TRADERA_PASS);
			await page.click("button[type=submit]");
		} catch (error) {

		} finally {
			await ScraperUtils.saveCookiesToFile(page)
		}
	}
}