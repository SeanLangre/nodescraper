// import got from 'got';
const jsdom = require("jsdom");
const puppeteer = require("puppeteer");
// import puppeteer from 'puppeteer';
// import json from './data.json' assert {type: 'json'};
// import("data.json", { assert: { type: "json" } });

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'
const linkPrefix = 'www.tradera.com'

export class Scraper {

	constructor() {
	}

	getURL(name, actionType) {
		return `https://www.tradera.com/search?q=${name}&itemType=${actionType}&${sortBy}`;
	}


	async stuff() {
		return "nfkjbngfnjbkjbn"
	}

	async headlessBrowser() {

		const browser = await puppeteer.launch({
			// headless: false
		});

		const page = await browser.newPage();

		let result = ''

		for (const data of json.list) {
			let url = this.getURL(data.searchterm, actionType);
			console.log(url)

			await page.goto(url);
			await page.waitForSelector('.site-pagename-SearchResults ');

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
				let title = element.window.document.body.querySelector('a').title
				let link = linkPrefix + element.window.document.body.querySelector('a').href
				let price = element.window.document.body.querySelector('.item-card-details-price').textContent
				return {
					oTitle: title,
					oLink: link,
					oPrice: price
				};
			});

			console.log("--infos--")
			console.log(`Total: ${infos.length}`)

			let filteredList = []
			infos.forEach(info => {
				for (let i = 0; i < data.keywords.length; i++) {
					const element = data.keywords[i];
					if (info.oTitle.toLowerCase().includes(element)) {
						filteredList.push(info)
					}
				}
			})
			console.log(filteredList)
			result += filteredList.toString()

		}
		await browser.close();

		return result
	}

}