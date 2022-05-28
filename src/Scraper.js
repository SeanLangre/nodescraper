import fs from 'fs';
import got from 'got';
import { JSDOM } from 'jsdom';
import datas from './data.json';
import ScraperUtils from './ScraperUtils.js';

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'
const linkPrefix = 'www.tradera.com'

export default class Scraper {

	constructor(page) {
		this.page = page
	}

	getURL(name, actionType) {
		return `https://www.tradera.com/search?q=${name}&itemType=${actionType}&${sortBy}`;
	}

	printStart() {
		console.log("")
		console.log("")
		console.log("")
		console.log("############################### START ####################################")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("############################# START SCRAPING #############################")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("#                                                                        #")
		console.log("################################# END ####################################")
		console.log("")
		console.log("")
		console.log("")
	}

	async Scrape() {
		this.printStart()
		var page = this.page
		let result = ''

		for (const data of datas.list) {
			let url = this.getURL(data.searchterm, actionType);
			console.log(url)

			await ScraperUtils.setCookiesInBrowser(page)
			await page.goto(url);
			await page.waitForSelector('.site-pagename-SearchResults ');

			await ScraperUtils.removeGDPRPopup(page)

			//page down
			for (let i = 0; i < 20; i++) {
				await page.keyboard.press("PageDown");
				await page.waitForTimeout(50)
			}

			//#region click wishbutton
			let newdata = data
			await page.evaluate((newdata) => {
				const elements = [...document.querySelectorAll('[aria-label="Spara i minneslistan"]')];
				for (let i = 0; i < newdata.keywords.length; i++) {
					const whitelist = newdata.keywords[i]?.toLowerCase();
					const blacklist = newdata.blacklist[i]?.toLowerCase();
					const targetElement = elements.find(e => {
						let lowercase = e.parentElement.parentElement.innerHTML.toLowerCase()
						return lowercase.includes(whitelist) && !lowercase.includes(blacklist)
					});
					targetElement && targetElement.click();
				}
			}, newdata)
			//#endregion

			//#region Gather and print elements
			let list = await page.$$('.item-card-container');

			let htmlList = list.map(async element => {
				return await (await element.getProperty('outerHTML')).jsonValue()
			});

			let newList = []
			for (const element of htmlList) {
				let e = await element
				newList.push(e)
			}

			//convert to jsdom elements
			let jsdoms = []
			newList.forEach(element => {
				jsdoms.push(new JSDOM(element))
			});

			var wishButtons = []

			let infos = await jsdoms.map(element => {
				//get info
				let title = element.window.document.body.querySelector('a').title

				if (ScraperFilter(data, title)) {

				} else {
					return
				}

				let link = linkPrefix + element.window.document.body.querySelector('a').href
				let price = element.window.document.body.querySelector('.item-card-details-price').textContent
				let date = element.window.document.body.querySelector('.item-card-animate-time').textContent
				let wish = ""

				let contentButton = element.window.document.body.querySelector('.mb-1')
				let contentInnerHtml = contentButton.innerHTML
				if (contentInnerHtml.includes("Sparad i minneslistan")) {
					wish = "YES"
				} else if (contentInnerHtml.includes("Spara i minneslistan")) {
					wish = "NO"
					let buttonJSDOMElement = new JSDOM(contentInnerHtml)
					let button = buttonJSDOMElement.window.document.body.querySelector('[aria-label="Spara i minneslistan"]')

					wishButtons.push(button)
				}

				return new InfoElement(title, link, price, wish, date)
			});

			infos = infos.filter(x => x !== undefined);
			//#endregion

			console.log("--infos--")
			console.log(`Total: ${infos.length}`)

			console.log(infos)
			for (let i = 0; i < infos.length; i++) {
				result += infos[i].toString();
			}
		}
		console.log("--DONE--")

		// fs.writeFile("newData.txt", result, function (err) {
		// 	if (err) {
		// 		console.log(err);
		// 	}
		// });

		return result
	}


}


export function ScraperFilter(data, title) {
	let lowercaseTitle = title.toLowerCase()
	for (let i = 0; i < data.keywords.length; i++) {
		const whitelist = data.keywords[i]?.toLowerCase();
		const blacklist = data.blacklist[i]?.toLowerCase();
		if (lowercaseTitle.includes(whitelist) && !lowercaseTitle.includes(blacklist)) {
			return true
		}
	}
	return false
}

export class InfoElement {
	constructor(title, link, price, wish, date) {
		this.title = title
		this.link = link
		this.price = price
		this.wish = wish
		this.date = date
	}

	toString() {
		return this.title + "\n" + this.link + "\n" + this.price + "\n" + this.date + "\n" + this.wish + "\n"
	}
}