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

		//get all links
		const htmlList = await page.$$eval('a', (links) => {
			let filteredLinks = links.filter(element => {
				if (element.title !== '') {
					return element
				}
			})

			return filteredLinks.map(link => link.outerHTML)
		});
		
		//convert to jsdom elements
		let jsdoms = []
		htmlList.forEach(element => {
			jsdoms.push(new JSDOM(element))
		});

//"<svg viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\" class=\"icon d-none d-md-block\"><path clip-rule=\"evenodd\" d=\"M1.5 8c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5S1.5 11.6 1.5 8zM8 .5C3.9.5.5 3.9.5 8s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5S12.1.5 8 .5zm.6 11.2c0 .3-.2.5-.6.5s-.5-.2-.6-.5V6.6c0-.3.2-.5.6-.5.3 0 .5.2.6.5zm.1-7.2c0 .4-.3.7-.7.7s-.7-.3-.7-.7.3-.7.7-.7.7.3.7.7z\" fill-rule=\"evenodd\"></path></svg><svg viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon-md d-md-none d-block\"><path clip-rule=\"evenodd\" d=\"M1.5 8c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5S1.5 11.6 1.5 8zM8 .5C3.9.5.5 3.9.5 8s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5S12.1.5 8 .5zm.6 11.2c0 .3-.2.5-.6.5s-.5-.2-.6-.5V6.6c0-.3.2-.5.6-.5.3 0 .5.2.6.5zm.1-7.2c0 .4-.3.7-.7.7s-.7-.3-.7-.7.3-.7.7-.7.7.3.7.7z\" fill-rule=\"evenodd\"></path></svg><span class=\"slim-header__link-text full-size-link d-none pl-lg-1 d-xl-inline\">Så fungerar Tradera</span>"

		//remove none item cards
		jsdoms = jsdoms.filter(element => {
			let itemcard = element.window.document.querySelector(".item-card-image")
			if(itemcard !== undefined && itemcard !== null){
				return element
			}
		})

		let infos = jsdoms.map(element => {
			//get info
			let title = element.window.document.body.querySelector('a').title
			let link = linkPrefix + element.window.document.body.querySelector('a').href
			return {
				oTitle: title,
				oLink: link
			};
		});

		console.log("--infos--")
		console.log(`Total: ${infos.length}`)
		// console.log(infos.map(element => {
		// 	return element.window.document.activeElement.innerHTML
		// }))
		console.log(infos)
		

	}

	await browser.close();
}

function getURL(name, actionType) {
	return `https://www.tradera.com/search?q=${name}&itemType=${actionType}&${sortBy}`;
}

await headlessBrowser()