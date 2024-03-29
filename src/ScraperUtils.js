import fs from 'fs';
const cookiesPath = './src/cookies.txt'
const localStoragePath = 'localstorage.txt'

class ScraperUtils {

	static async clickLoginGDPRPopup(page) {
		try {
			let btn = '.css-14ubilm'
			let btn2 = '.qc-cmp2-buttons-desktop'
			// await page.waitForSelector(btn);
			await page.click(btn, { timeout: 2000 });
			await page.waitForTimeout(1000)
			return await page.click(btn, { timeout: 2000 });
		} catch (error) {
			return
		} finally {
			return
		}
	}

	static async removeGDPRPopup(page) {
		let div_selector_to_remove = ".qc-cmp2-container";
		return await page.evaluate((sel) => {
			var elements = document.querySelectorAll(sel);
			for (var i = 0; i < elements.length; i++) {
				elements[i].parentNode.removeChild(elements[i]);
			}
		}, div_selector_to_remove)
	}

	// Write Cookies
	static async saveCookiesToFile(page) {
		const cookiesObject = await page.cookies()
		return await fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
	}

	// If the cookies file exists, read the cookies.
	static async setCookiesInBrowser(page) {
		const previousSession = await fs.existsSync(cookiesPath)
		if (previousSession) {
			const content = await fs.readFileSync(cookiesPath);
			try {
				const cookiesArr = JSON.parse(content);
				if (cookiesArr.length !== 0) {
					for (let cookie of cookiesArr) {
						await page.setCookie(cookie)
					}
					console.log('Session has been loaded in the browser')
					return true;
				}
			} catch (error) {
				console.log('ERROR! COULD NOT USE COOKIES FILE')
				return false;
			}
		}
		return false;
	}

	static async saveLocalStorageToFile(page) {
		// var localStorageData = await page.evaluate(() => {
		// 	var localStorage = window.localStorage
		// 	let textFile = {};
		// 	for (let i = 0; i < localStorage.length; i++) {
		// 		const key = localStorage.key(i);
		// 		textFile[key] = localStorage.getItem(key);
		// 	}
		// 	return textFile;
		// });
		var localStorageData = await page.evaluate(() => Object.assign({}, window.localStorage));
		return await fs.writeFileSync(localStoragePath, JSON.stringify(localStorageData));
	}

	// static async setLocalStorageInBrowser(page) {
	// 	var previousSession = await fs.existsSync(localStoragePath)
	// 	if (previousSession) {
	// 		const content = await fs.readFileSync(localStoragePath);
	// 		const cookiesArr = JSON.parse(content);
	// 		if (cookiesArr.length !== 0) {
	// 			for (let cookie of cookiesArr) {
	// 				await page.setCookie(cookie)
	// 			}
	// 			console.log('Session has been loaded in the browser')
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// }

	static PrintScrape(str) {
		console.log("")
		console.log("")
		console.log("")
		console.log("############################### START ####################################")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log(`############################# ${str} #############################`)
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("################################# END ####################################")
		console.log("")
		console.log("")
		console.log("")
	}

}

export default ScraperUtils;