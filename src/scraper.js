import fs from 'fs';
import got from 'got';
import { JSDOM } from 'jsdom';
import datas from './data.json';
import ScraperLogin from './login.js';
import ScraperPage from './page.js';

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'
const linkPrefix = 'www.tradera.com'

export class Scraper {

	constructor(page) {
		this.page = page
	}

	getURL(name, actionType) {
		return `https://www.tradera.com/search?q=${name}&itemType=${actionType}&${sortBy}`;
	}


	async stuff() {
		return "nfkjbngfnjbkjbn"
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

		// const browser = await puppeteer.launch({
		// 	// headless: false
		// });

		var page = this.page

		let result = ''

		for (const data of datas.list) {
			let url = this.getURL(data.searchterm, actionType);
			console.log(url)

			await page.goto(url);
			await page.waitForSelector('.site-pagename-SearchResults ');

			this.removeGDPRPopup(page)

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

			let infos = jsdoms.map(element => {
				//get info

				let contentInnerHtml = element.window.document.body.querySelector('.mb-1').innerHTML
				if(contentInnerHtml.includes("Sparad i minneslistan")){
					// console.log("sparad")
					return;
				} else if (contentInnerHtml.includes("Spara i minneslistan")) {
					// console.log("inte sparad")
				}

				let title = element.window.document.body.querySelector('a').title
				let link = linkPrefix + element.window.document.body.querySelector('a').href
				let price = element.window.document.body.querySelector('.item-card-details-price').textContent

				return new InfoElement(title, link, price)

			});

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

		await browser.close();

		fs.writeFile("newData.txt", result, function (err) {
			if (err) {
				console.log(err);
			}
		});

		return result
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

export class InfoElement {
	constructor(title, link, price) {
		this.title = title
		this.link = link
		this.price = price
	}

	toString() {
		return this.title + "\n" + this.link + "\n" + this.price + "\n"
	}
}

var scraperPage = new ScraperPage()
var page = await scraperPage.GeneratePage()

var loginScraper = new ScraperLogin(page)
await loginScraper.Login()

var scraper = new Scraper(page)
await scraper.Scrape()
