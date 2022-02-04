import got from 'got';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import datas from './data.json';

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'

// function getCurrentURL(index){
// 	data.list.forEach(element => {
// 		console.log(element);
// 	});
// }


async function headlessBrowser() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	let keywords = '';

	for (const data of datas.list) {
		let url = getURL(data.searchterm, actionType);
		console.log(url)

		await page.goto(url);
		await page.waitForSelector('.site-pagename-SearchResults ');

		keywords = data.keywords
		const divs = await page.$$eval('a', a => a.filter(element => {
			if (element.title !== '') {
				//TODO. make title lowercase
				lowerCaseTitle = element.title.toLowerCase()

				//for (const word of keywords) {
				//	if (lowerCaseTitle.includes(word)) {
				return element
				//	}
				//}
			}
		}).map(ahref => ahref.title));

		console.log(divs)
	}

	await browser.close();
}

function getURL(name, actionType) {
	return `https://www.tradera.com/search?q=${name}&itemType=${actionType}&${sortBy}`;
}




async function searchPage(page, data) {
	// await page.focus('#site-header-search-input-')
	// await page.keyboard.type('Arkham Horror')
	// await page.keyboard.press('Enter');

	await page.waitForSelector('.site-pagename-SearchResults ');

	// await page.focus('#filter-itemType-Auction')

	// await page.waitForSelector('#btn d-flex align-items-center py-2 text-left px-1 cursor-pointer unbutton')

	const divs = await page.$$eval('a', a => a.filter(element => {
		if (element.title !== '') {
			return element
		}
	}).map(ahref => ahref.title));

	console.log(divs)
}

await headlessBrowser()