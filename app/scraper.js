import got from 'got';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import datas from './data.json';

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'


async function headlessBrowser() {
	const browser = await puppeteer.launch({
	});
	const page = await browser.newPage();

	for (const data of datas.list) {
		let url = getURL(data.searchterm, actionType);
		console.log(url)

		await page.goto(url);
		await page.waitForSelector('.site-pagename-SearchResults ');

		//get all links
		const htmlList = await page.$$eval('a', (links) => {
			return links.map(link => link.outerHTML)
		});

		console.log(htmlList)

		//convert to jsdom elements
		let jsdoms = []
		htmlList.forEach(element => {
			jsdoms.push(new JSDOM(element))
		});
	}

	await browser.close();
}

function getURL(name, actionType) {
	return `https://www.tradera.com/search?q=${name}&itemType=${actionType}&${sortBy}`;
}

await headlessBrowser()