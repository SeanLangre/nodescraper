import { JSDOM } from 'jsdom';
import ScraperUtils from './ScraperUtils.js';

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'
const linkPrefix = 'www.tradera.com'

const State = {
	Start: 'Start',
	GotoPage: 'GotoPage',
	Scroll: 'Scroll',
	ClickStart: 'ClickStart',
	GetGrandParent: 'GetGrandParent',
	GetPropertyJsonValue: 'GetPropertyJsonValue',
	GetCurrentPrice: 'GetCurrentPrice',
	StartShouldClick: 'StartShouldClick',
	AwaitClick: 'AwaitClick',
	GettingPrintInfo: 'GettingPrintInfo',
	CreatingPrint: 'CreatingPrint',
	ResolvePrintPromises: 'ResolvePrintPromises',
	Return: 'Return'
};

export default class Scraper {
	constructor() {
		this._state = State.Start
	}


	async ScrollDown(page) {
		await page.evaluate(async () => {
			let scrollPosition = 0
			let documentHeight = document.body.scrollHeight

			while (documentHeight > scrollPosition) {
				window.scrollBy(0, documentHeight)
				// await new Promise(resolve => {
				// 	setTimeout(resolve, 1000)
				// })
				scrollPosition = documentHeight
				documentHeight = document.body.scrollHeight
			}
		})
	}

	getURL(name, auctionType) {
		name = name.replaceAll(" ", "%20");
		return `https://www.tradera.com/search?q=${name}&itemType=${auctionType}&${sortBy}`;
	}

	async ScrapeWrapper(data, page, id) {
		let intervalId = setInterval(this.TimerTick, 10000, id, this);
		let response = await this.Scrape(data, page, id)
		clearInterval(intervalId)
		console.log(`End Scrape Status: ${response?.status} Id: (${response?.id}): [ ${data.searchterm} ] ${response?.url}`)
		return await response;
	}

	TimerTick(id, scraper) {
		console.log(`Working...  id:${id} State:${scraper.GetState()}`)
	}

	GetState() {
		return this._state
	}

	async Scrape(data, page, id) {
		let url = this.getURL(data.searchterm, actionType);
		if (data.ignore === "true") {
			console.log(`Scrape IGNORE (${id}) ${url}`)
			return { status: "Ignore", id: id, url: url, result: "" }
		}
		await console.log(`Scrape SearchTerm (${id}): [ ${data.searchterm} ]`)
		await page.setDefaultNavigationTimeout(0)
		this._state = State.GotoPage
		await page.goto(url);
		await page.waitForSelector('.site-pagename-SearchResults ');

		await ScraperUtils.removeGDPRPopup(page)

		this._state = State.Scroll
		await this.ScrollDown(page);

		//wish button
		let result = await page.$$('[aria-label="Spara i minneslistan"]');

		this._state = State.ClickStart

		for (const element of result) {
			let shouldClick = false
			// let parent = (await element.$x('..'))[0]; // get parent
			// let parentParent = (await parent.$x('..'))[0]; // get parent
			this._state = State.GetGrandParent

			let grandParent = (await element.$x('../..'))[0]; // get grandparent
			this._state = State.GetPropertyJsonValue
			let innerHTML = await (await grandParent.getProperty('innerText')).jsonValue() //get property like innerhtml from puppeteer elementHandle
			let elementLC = innerHTML.toLowerCase()

			const splitText = elementLC.split("\n");

			this._state = State.GetCurrentPrice

			let currentPrice = await (() => {
				let result = undefined;
				let match = 'kr';

				return (() => {
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
							return result;
						}
					}
					return result;
				})();
			})();

			if (currentPrice === undefined) {
				continue;
			}

			this._state = State.StartShouldClick

			shouldClick = await this.ShouldClick(data, elementLC);

			if (shouldClick && element) {
				this._state = State.AwaitClick
				try {
					element.click()
				} catch (error) {
					console.log("element.click() ERROR");
					console.log(error);
					throw error
				}
			}
		}
		this._state = State.GettingPrintInfo

		//Gather and print elements
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

		this._state = State.CreatingPrint

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

		this._state = State.ResolvePrintPromises

		let infos = await Promise.all(infoPromises);

		infos = await infos.filter(x => x !== undefined);
		this._state = State.Return
		return { status: "Success", id: id, url: url, result: infos }
	}

	async ShouldClick(data, elementLC) {
		let shouldClick = false
		for (let wish of data.keywords) {
			wish = wish.toLowerCase()
			if (elementLC.includes(wish)) {
				shouldClick = true
				break
			}
		}
		for (let deny of data.blacklist) {
			deny = deny.toLowerCase()
			if (deny && deny.length != 0 && elementLC.includes(deny)) {
				shouldClick = false
				break
			}
		}
		return shouldClick
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