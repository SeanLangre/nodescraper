import fs from 'fs';
import got from 'got';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import datas from './data.json';

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

		for (const data of datas.list) {
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
	// async onlyOne() {

	// 	const browser = await puppeteer.launch({
	// 		// headless: false
	// 	});

	// 	const page = await browser.newPage();

	// 	let result = ''

	// 	let data = datas.list[0]

	// 	let url = this.getURL(data.searchterm, actionType);
	// 	console.log(url)

	// 	await page.goto(url);
	// 	await page.waitForSelector('.site-pagename-SearchResults ');

	// 	//page down
	// 	for (let i = 0; i < 20; i++) {
	// 		await page.keyboard.press("PageDown");
	// 		await page.waitForTimeout(100)
	// 	}

	// 	let list = await page.$$('.item-card-container');

	// 	let htmlList = list.map(async element => {
	// 		return await (await element.getProperty('outerHTML')).jsonValue()
	// 	});

	// 	let newList = []
	// 	for (const element of htmlList) {
	// 		let e = await element
	// 		newList.push(e)
	// 	}

	// 	//convert to jsdom elements
	// 	let jsdoms = []
	// 	newList.forEach(element => {
	// 		jsdoms.push(new JSDOM(element))
	// 	});

	// 	let infos = jsdoms.map(element => {
	// 		//get info
	// 		let title = element.window.document.body.querySelector('a').title
	// 		let link = linkPrefix + element.window.document.body.querySelector('a').href
	// 		let price = element.window.document.body.querySelector('.item-card-details-price').textContent
	// 		return {
	// 			oTitle: title,
	// 			oLink: link,
	// 			oPrice: price
	// 		};
	// 	});

	// 	console.log("--infos--")
	// 	console.log(`Total: ${infos.length}`)

	// 	let filteredList = []
	// 	infos.forEach(info => {
	// 		for (let i = 0; i < data.keywords.length; i++) {
	// 			const element = data.keywords[i];
	// 			if (info.oTitle.toLowerCase().includes(element)) {
	// 				filteredList.push(info)
	// 			}
	// 		}
	// 	})
	// 	// console.log(filteredList)
	// 	// result = filteredList.map((element)=>{
	// 	// 	// return element.toString();
	// 	// 	return element.oTitle + ' ' + element.oPrice + ' ' + element.oLink + ' ';
	// 	// 	// return element.oTitle + '\\n' + element.oPrice + '//n' + element.oLink + '\n\n';
	// 	// })

	// 	await browser.close();

	// 	return filteredList
	// }
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

var scraper = new Scraper()
scraper.headlessBrowser()