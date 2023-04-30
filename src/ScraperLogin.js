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
		let email = process.env.TRADERA_USERNAME
		let pass = process.env.TRADERA_PASS
		
        console.log("1");
		var page = this.page
        console.log("2");
		let url = this.getURL();
        console.log("3");
		console.log(url)
        console.log("4");
		page.goto(url);
        console.log("5");
		await page.waitForTimeout(2000)
        console.log("click gdpr");
		
		await ScraperUtils.clickLoginGDPRPopup(page)
		await page.waitForTimeout(2000)
        console.log("lets write pass");
		

		try {
			// await page.type("input[type=text]", process.env.TRADERA_USERNAME);
			// await page.type("input[type=password]", process.env.TRADERA_PASS);
			// await page.click("button[type=submit]");

			await page.waitForTimeout(130)
			const emailInput = await page.$('#login-box-mail');
			await emailInput.type(email);
		  
			await page.waitForTimeout(130)
			const passwordInput = await page.$('#login-box-password');
			await passwordInput.type(pass);
		  
			await page.waitForTimeout(130)
			// Optional: submit the form to log in
			const submitButton = await page.$('button[type=submit]');
			await submitButton.click();

		} catch (error) {
			
		} finally {
			await ScraperUtils.saveCookiesToFile(page)
		}
	}
}

//<input type="text" id="login-box-mail" name="mail" rel="" tabindex="1" placeholder="Ange e-postadress" class="form-control mb-2" data-field-text="" autocapitalize="none" autofocus="">
//<input type="password" id="login-box-password" name="password" rel="" tabindex="2" placeholder="Lösenord" class="form-control my-2 " data-field-text="" autocapitalize="none">