import got from 'got';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';

const name = 'arkham%20horror'
const actionType = 'Auction'

const url = `https://www.tradera.com/search?q=${name}&itemType=${actionType}`;

async function headlessBrowser() {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto(url);

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

	await browser.close();
}

await headlessBrowser();