import fs from 'fs';
const cookiesPath = 'cookies.txt'

class ScraperUtils {

	static async removeGDPRPopup(page) {
		let div_selector_to_remove = ".qc-cmp2-container";
		return await page.evaluate((sel) => {
			var elements = document.querySelectorAll(sel);
			for (var i = 0; i < elements.length; i++) {
				elements[i].parentNode.removeChild(elements[i]);
			}
		}, div_selector_to_remove)
	}

	static async saveCredentialsToFile(page) {
		// Write Cookies
		const cookiesObject = await page.cookies()
		return await fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
		// console.log('Session has been saved to ' + cookiesPath);
	}

	static async readCredentialsFile(page) {
		// If the cookies file exists, read the cookies.
		const previousSession = fs.existsSync(cookiesPath)
		if (previousSession) {
			const content = fs.readFileSync(cookiesPath);
			const cookiesArr = JSON.parse(content);
			if (cookiesArr.length !== 0) {
				for (let cookie of cookiesArr) {
					await page.setCookie(cookie)
				}
				console.log('Session has been loaded in the browser')
			}
		}
	}

}

export default ScraperUtils;