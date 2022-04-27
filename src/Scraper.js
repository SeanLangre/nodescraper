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

	async Scrape() {
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
				await page.waitForTimeout(100)
			}

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
				let wish = ""

				let contentButton = element.window.document.body.querySelector('.mb-1')
				let contentInnerHtml = contentButton.innerHTML
				if (contentInnerHtml.includes("Sparad i minneslistan")) {
					wish = "yes"
				} else if (contentInnerHtml.includes("Spara i minneslistan")) {
					wish = "no"

					let buttonJSDOMElement = new JSDOM(contentInnerHtml)
					// let button = buttonJSDOMElement.window.document.body.querySelector('[class^="item-card-buttons d-flex flex-column"]')
					// let button = buttonJSDOMElement.window.document.body.querySelector('[class^="btn btn-round item-card-wishlist-button btn-md-sm mb-1"]')
					// let button = buttonJSDOMElement.window.document.body.querySelector('[class*="item-card-wishlist-button"]')
					let button = buttonJSDOMElement.window.document.body.querySelector('[aria-label="Spara i minneslistan"]')

					//buttonJSDOMElement.window.document.body.querySelector('[aria-label="Spara i minneslistan"]')

					console.log("button.outerHTML")
					console.log(button.outerHTML)

					// button.click()

					
					wishButtons.push(button)
				}

				let title = element.window.document.body.querySelector('a').title
				let link = linkPrefix + element.window.document.body.querySelector('a').href
				let price = element.window.document.body.querySelector('.item-card-details-price').textContent
				let date = element.window.document.body.querySelector('.item-card-animate-time').textContent

				return new InfoElement(title, link, price, wish, date)
			});

			for (let i = 0; i < wishButtons.length; i++) {
				await page.waitForTimeout(200)
				wishButtons[i].click()
			}

			console.log("--infos--")
			console.log(`Total: ${infos.length}`)

			let filteredList = []
			infos.forEach(info => {
				for (let i = 0; i < data.keywords.length; i++) {
					const element = data.keywords[i];
					if (info.title.toLowerCase().includes(element)) {
						filteredList.push(info)
					}
				}
			})
			console.log(filteredList)
			for (let i = 0; i < filteredList.length; i++) {
				result += filteredList[i].toString();
			}
		}
		console.log("--DONE--")

		fs.writeFile("newData.txt", result, function (err) {
			if (err) {
				console.log(err);
			}
		});

		return result
	}
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