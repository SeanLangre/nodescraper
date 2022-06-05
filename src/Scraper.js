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
		let page = this.page
		let result = ''

		for (const data of datas.list) {
			let url = this.getURL(data.searchterm, actionType);
			console.log(url)

			await ScraperUtils.setCookiesInBrowser(page)
			await page.goto(url);
			await page.waitForSelector('.site-pagename-SearchResults ');

			//await page.waitForTimeout(50000)
			
			await ScraperUtils.removeGDPRPopup(page)

			//page down
			for (let i = 0; i < 20; i++) {
				await page.keyboard.press("PageDown");
				await page.waitForTimeout(50)
			}

			//#region click wishbutton
			let result = await page.$$('[aria-label="Spara i minneslistan"]');

			for (const element of result) {
				let shouldClick = false
				// let parent = (await element.$x('..'))[0]; // get parent
				// let parentParent = (await parent.$x('..'))[0]; // get parent
				let grandParent = (await element.$x('../..'))[0]; // get grandparent
				let innerHTML = await (await grandParent.getProperty('innerText')).jsonValue() //get property like innerhtml from puppeteer elementHandle
				let elementLC = innerHTML.toLowerCase()
				// console.log(`element ${element}`)
				data.keywords.forEach(wish => {
					wish = wish.toLowerCase()
					if (elementLC.includes(wish)) {
						shouldClick = true
						return
					}
				});
				data.blacklist.forEach(deny => {
					deny = deny.toLowerCase()
					if (deny && deny.length != 0 && elementLC.includes(deny)) {
						shouldClick = false
						return
					}
				});

				if (shouldClick) {
					element && element?.click();
				}
			}

			//#endregion

			// await page.waitForTimeout(50000)

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

			let wishButtons = []

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
				result += infos[i]?.toString();
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
	let shouldInclude = false

	data.keywords.forEach(wish => {
		wish = wish.toLowerCase()
		if (lowercaseTitle.includes(wish)) {
			shouldInclude = true
		}
	});
	data.blacklist.forEach(deny => {
		deny = deny.toLowerCase()
		if (deny && deny.length != 0 && lowercaseTitle.includes(deny)) {
			shouldInclude = false
		}
	});
	return shouldInclude
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