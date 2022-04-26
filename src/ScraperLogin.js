
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
		console.log("")
		console.log("")
		console.log("")
		console.log("##############################  START  ###################################")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("#############################     LOGIN      #############################")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("################################  END  ###################################")
		console.log("")
		console.log("")
		console.log("")

		var page = this.page

		let url = this.getURL();
		console.log(url)
		await page.goto(url);
		await page.waitForTimeout(100)
		await ScraperUtils.removeGDPRPopup(page)

		await page.type("input[type=text]", process.env.TRADERA_USERNAME);
		await page.type("input[type=password]", process.env.TRADERA_PASS);
		await page.click("button[type=submit]");

		await ScraperUtils.saveCredentialsToFile(page)
	}
}