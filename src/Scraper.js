import { JSDOM } from 'jsdom';
import ScraperUtils from './ScraperUtils.js';

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'
const linkPrefix = 'www.tradera.com'

export default class Scraper {
	constructor() {
	}

	async ScrollDown(page) {
		await page.evaluate(async () => {
			let scrollPosition = 0
			let documentHeight = document.body.scrollHeight

			while (documentHeight > scrollPosition) {
				window.scrollBy(0, documentHeight)
				await new Promise(resolve => {
					setTimeout(resolve, 1000)
				})
				scrollPosition = documentHeight
				documentHeight = document.body.scrollHeight
			}
		})
	}

	getURL(name, auctionType) {
		name = name.replaceAll(" ", "%20");
		return `https://www.tradera.com/search?q=${name}&itemType=${auctionType}&${sortBy}`;
	}

	async Scrape(data, page, id) {

		let url = this.getURL(data.searchterm, actionType);
		if (data.ignore === "true") {
			console.log("Scrape IGNORE" + url)
			return
		}
		await page.waitForTimeout(50)

		console.log(`Scrape SearchTerm (${id}): [ ${data.searchterm} ]`)

		// await ScraperUtils.setCookiesInBrowser(page)
		await page.goto(url);
		await page.waitForSelector('.site-pagename-SearchResults ');

		//await page.waitForTimeout(50000)

		await ScraperUtils.removeGDPRPopup(page)


		let syncScroll = false;

		if (syncScroll) {
			await page.keyboard.press("PageDown")
			await page.waitForTimeout(50)
			await page.keyboard.press("PageDown")
			await page.waitForTimeout(50)
			await page.keyboard.press("PageDown")
			await page.waitForTimeout(50)
			await page.keyboard.press("PageDown")
			await page.waitForTimeout(50)
		} else {
			await page.waitForTimeout(50)
			await this.ScrollDown(page);
			await page.waitForTimeout(50)
		}


		//#region click wishbutton
		let result = await page.$$('[aria-label="Spara i minneslistan"]');

		await page.waitForTimeout(50)

		for (const element of result) {
			let shouldClick = false
			// let parent = (await element.$x('..'))[0]; // get parent
			// let parentParent = (await parent.$x('..'))[0]; // get parent
			let grandParent = (await element.$x('../..'))[0]; // get grandparent
			let innerHTML = await (await grandParent.getProperty('innerText')).jsonValue() //get property like innerhtml from puppeteer elementHandle
			let elementLC = innerHTML.toLowerCase()

			const splitText = elementLC.split("\n");
			let currentPrice = await (() => {
				let result = undefined;
				let match = 'kr';
				for (const e of splitText) {
					let eString = e.toString();
					if (eString.includes(match)) {
						let regex = /\D/g;
						let price = eString.replace(regex, "");
						if (data.maxPrice !== undefined) {
							if (parseInt(price) < parseInt(data.maxPrice)) {
								result = price;
							}
						} else if (data.maxPrice === undefined) {
							result = price;
						}
						// break;
					}
				}

				return result;
			})();

			if (currentPrice === undefined) {
				continue;
			}

			for (let wish of data.keywords) {
				wish = wish.toLowerCase()
				if (elementLC.includes(wish)) {
					shouldClick = true
					return
				}
			}
			for (let deny of data.blacklist) {
				deny = deny.toLowerCase()
				if (deny && deny.length != 0 && elementLC.includes(deny)) {
					shouldClick = false
					return
				}
			}

			if (shouldClick) {
				element && await element?.click();
			}
		}

		//#endregion

		//#region Gather and print elements
		let list = await page.$$('.item-card-container');

		let htmlList = await list.map(async element => {
			return await (await element.getProperty('outerHTML')).jsonValue()
		});

		let newList = []
		for (const element of htmlList) {
			let e = await element
			newList.push(e)
		}

		//convert to jsdom elements
		let jsdoms = []
		for (const element of newList) {
			jsdoms.push(new JSDOM(element))
		}

		let wishButtons = []

		let infoPromises = await jsdoms.map(async element => {
			//get info
			let title = await element.window.document.body.querySelector('a')?.title

			if (ScraperFilter(data, title)) {

			} else {
				return
			}

			let link = linkPrefix + await element.window.document.body.querySelector('a')?.href
			let price = await element.window.document.body.querySelector('.item-card-details-price')?.textContent
			let date = await element.window.document.body.querySelector('.item-card-animate-time')?.textContent
			let wish = ""

			let contentButton = await element.window.document.body.querySelector('.mb-1')
			let contentInnerHtml = contentButton?.innerHTML
			if (contentInnerHtml?.includes("Sparad i minneslistan")) {
				wish = "YES"
			} else if (contentInnerHtml?.includes("Spara i minneslistan")) {
				wish = "NO"
				let buttonJSDOMElement = new JSDOM(contentInnerHtml)
				let button = await buttonJSDOMElement.window.document.body.querySelector('[aria-label="Spara i minneslistan"]')

				wishButtons.push(button)
			}

			return new InfoElement(title, link, price, wish, date)
		});

		let infos = await Promise.all(infoPromises);

		infos = await infos.filter(x => x !== undefined);
		//#endregion

		// console.log("--infos--")
		console.log(`End    SearchTerm (${id}): [ ${data.searchterm} ] ${url}`)
		if (infos.length > 0) {
			console.log(infos)
		}
		await page.waitForTimeout(50)
		return await infos;
	}

	static PrintScrapeStart() {
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