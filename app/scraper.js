import got from 'got';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import datas from './data.json';

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'
const linkPrefix = 'www.tradera.com'


async function headlessBrowser() {
	const browser = await puppeteer.launch({
		// headless: false
	});
	const page = await browser.newPage();

	for (const data of datas.list) {
		let url = getURL(data.searchterm, actionType);
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
		// console.log(infos)
	}
	await browser.close();
}

function getURL(name, actionType) {
	return `https://www.tradera.com/search?q=${name}&itemType=${actionType}&${sortBy}`;
}

await headlessBrowser()