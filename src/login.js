
import puppeteer from 'puppeteer';

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

		// const browser = await puppeteer.launch({
		// 	headless: false
		// });

		// const page = await browser.newPage();

		var page = this.page

		let url = this.getURL();
		console.log(url)
		await page.goto(url);
		await page.waitForTimeout(100)
		await this.removeGDPRPopup(page)

		// await page.authenticate({ 'username': 'conk3r_xd@hotmail.com', 'password': '47dkhw2dDba746' })
		await page.type("input[type=text]", "conk3r_xd@hotmail.com");
		await page.type("input[type=password]", "47dkhw2dDba746");
		await page.click("button[type=submit]");
	}

	async removeGDPRPopup(page) {
		let div_selector_to_remove = ".qc-cmp2-container";
		return await page.evaluate((sel) => {
			var elements = document.querySelectorAll(sel);
			for (var i = 0; i < elements.length; i++) {
				elements[i].parentNode.removeChild(elements[i]);
			}
		}, div_selector_to_remove)
	}

}

function setCredentials() {
	// await page.evaluate(() => {
	// 	localStorage.setItem('noniabvendorconsent', 'PYEdO1PYEdO1AKAaAAPg');
	// });

	// let gdpr_cookie = {
	// 	'name': "gdpr_consent_v1",
	// 	'value': "1:1,2:1,3:1,4:1",
	// }

	// let euconsent = {
	// 	'name': "euconsent-v2",
	// 	'value': "CPWh9NhPWh9NhAKAnASVCICsAP_AAH_AACQgIqNd_X__bX9j-_5_f_t0eY1P9_r3_-QzjhfNt-8F3L_W_L0X42E7NF36pq4KuR4Eu3LBIQNlHMHUTUmwaokVrzHsak2cpyNKJ7LEmnMZO2dYGHtPn9lDuYKY7_5___bz3j-v_t_-39T378Xf3_d5_2---vCfV599jLv9f___39nP___9v-_8_______BEMAkw1LyALsyxwZNo0qhRAjCsJCoBQAUUAwtEVgA4OCnZWAT6ghYAIBUhGBECDEFGDAIABBIAkIiAkALBAIgCIBAACABAAhAARMAgsALAwCAAUA0LEAKAAQJCDI4IjlMCAqRKKCWysQSgr2NMIAyzwIoFEZFQAIkmgBYGQkLBzHAEgJeLJA0xQvkAAAA.YAAAAAAAAAAA",
	// }

	// let gdpr_dismissed_v1 = {
	// 	'name': "gdpr_dismissed_v1",
	// 	'value': "1"
	// }

	// let addtl_consent = {
	// 	'name': "addtl_consent",
	// 	'value': "1~39.4.3.9.6.9.13.6.4.15.9.5.2.7.4.1.7.1.3.2.10.3.5.4.21.4.6.9.7.10.2.9.2.18.7.6.14.5.20.6.5.1.3.1.11.29.4.14.4.5.3.10.6.2.9.6.6.4.5.4.4.29.4.5.3.1.6.2.2.17.1.17.10.9.1.8.6.2.8.3.4.142.4.8.35.7.15.1.14.3.1.8.10.25.3.7.25.5.18.9.7.41.2.4.18.21.3.4.2.1.6.6.5.2.14.18.7.3.2.2.8.20.8.8.6.3.10.4.20.2.13.4.6.4.11.1.3.22.16.2.6.8.2.4.11.6.5.33.11.8.1.10.28.12.1.3.21.2.7.6.1.9.30.17.4.9.15.8.7.3.6.6.7.2.4.1.7.12.13.22.13.2.12.2.10.1.4.15.2.4.9.4.5.4.7.13.5.15.4.13.4.14.8.2.15.2.5.5.1.2.2.1.2.14.7.4.8.2.9.10.18.12.13.2.18.1.1.3.1.1.9.25.4.1.19.8.4.5.2.1.5.4.8.4.2.2.2.14.2.13.4.2.6.9.6.3.4.3.5.2.3.6.10.11.6.3.16.3.11.3.1.2.3.9.19.11.15.3.10.7.6.4.3.4.6.3.3.3.3.1.1.1.6.11.3.1.1.7.4.6.1.10.5.2.6.3.2.2.4.3.2.2.7.2.13.7.12.2.1.3.3.4.5.4.3.2.2.4.1.3.1.1.1.2.9.1.6.9.1.5.2.1.7.2.8.11.1.3.1.1.2.1.3.2.6.1.12.5.3.1.3.1.1.2.2.7.7.1.4.1.2.6.1.2.1.1.3.1.1.4.1.1.2.1.8.1.7.4.3.2.1.3.5.3.9.6.1.15.10.28.1.2.2.12.3.4.1.6.3.4.7.1.3.1.1.3.1.5.3.1.3.2.2.1.1.4.2.1.2.1.1.1.2.2.4.2.1.2.2.2.4.1.1.1.2.2.1.1.1.1.2.1.1.1.2.2.1.1.2.1.2.1.7.1.2.1.1.1.2.1.1.1.1.2.1.1.3.2.1.1.8.1.1.1.5.2.1.6.5.1.1.1.1.1.2.2.3.1.1.4.1.1.2.2.1.1.4.2.1.1.2.2.1.2.1.2.3.1.1.2.4.1.1.1.5.1.3.6.3.1.5.2.3.4.1.2.3.1.4.2.1.2.2.2.1.1.1.1.1.1.11.1.3.1.1.2.2.1.4.2.3.3.4.1.1.1.1.4.2.1.1.2.5.1.9.4.1.1.3.1.7.1.4.5.1.7.2.1.1.1.2.1.1.1.4.2.1.12.1.1.3.1.2.2.3.1.2.1.1.1.2.1.1.2.1.1.1.1.2.1.3.1.5.1.2.4.3.8.2.2.9.7.2.2.1.2.1.4"
	// }

	// await page.setCookie(gdpr_cookie, euconsent, gdpr_dismissed_v1, addtl_consent)

}