import ScraperUtils from './ScraperUtils.js';

const actionType = 'Auction'
const sortBy = 'sortBy=TimeLeft'
const linkPrefix = 'www.tradera.com'

export default class Scraper {

	constructor() {
		// this.page = page
	}

	getURL(name, actionType) {
		return `https://www.tradera.com/search?q=${name}&itemType=${actionType}&${sortBy}`;
	}

	printStart() {
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

	async Scrape(data, page) {

		let url = this.getURL(data.searchterm, actionType);
		console.log(url)

		PrintTime("setCookiesInBrowser")
		await ScraperUtils.setCookiesInBrowser(page)

		PrintTime("goto(url)")
		await page.goto(url, { waitUntil: 'load', timeout: 120000 });
		//page down
		PrintTime("Page down")

		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");
		await page.keyboard.press("PageDown");

		await page.waitForSelector('.site-pagename-SearchResults ');
		await ScraperUtils.removeGDPRPopup(page)

		//#region click wishbutton
		PrintTime("Start searching")
		let notWishedList = await page.$$('[aria-label="Spara i minneslistan"]');
		let wishedList = await page.$$('[aria-label="Sparad i minneslistan"]');
		let infoElements = []

		for await (const handle of notWishedList) {
			let shouldClick = false
			let grandParent = (await handle.$x('../..'))[0]; // get grandparent
			let innerHTML = await (await grandParent.getProperty('innerText')).jsonValue() //get property like innerhtml from puppeteer elementHandle
			let elementLC = innerHTML.toLowerCase()
			// let parent = (await handle.$x('..'))[0]; // get grandparent
			// let grandGrandParent = (await handle.$x('../../..'))[0]; // get grandparent
			// console.log(`element ${element}`)
			// PrintTime("Start wish")

			for await (let wish of data.keywords) {
				let wishLC = wish.toLowerCase()
				if (elementLC.includes(wishLC)) {
					shouldClick = true
					return
				}

			}
			// data.keywords.forEach(wish => {
			// });
			// PrintTime("Start blacklist")

			for await (let deny of data.blacklist) {
				let denyLC = deny.toLowerCase()
				if (denyLC && denyLC.length != 0 && elementLC.includes(denyLC)) {
					shouldClick = false
					return
				}
			}
			// data.blacklist.forEach(deny => {
			// });

			if (shouldClick) {
				//set info
				// let inner1 = await GetHandleProperty(handle, 'innerHTML');
				// let title1 = await GetHandleProperty(grandGrandParent, 'title'); //get property like innerhtml from puppeteer elementHandle
				let title = innerHTML
				// let link = linkPrefix + await (await grandParent.getProperty('a')).jsonValue() //get property like innerhtml from puppeteer elementHandle
				// let price = await (await grandParent.getProperty('.item-card-details-price')).jsonValue()
				// let date = await (await grandParent.getProperty('.item-card-animate-time')).jsonValue()
				let infoElement = new InfoElement(title, null, null, null, null)
				infoElements.push(infoElement)

				//click
				PrintTime("click handle waitForTimeout start")

				await page.waitForTimeout(200)

				if (handle) { // && handle !== 'undefined' && handle instanceof HTMLElement
					PrintTime("click handle")
					try {
						handle?.click();
					} catch (error) {
						console.log(error)
					}
				}
			}
		}

		console.log(`Total: ${wishedList.length} / ${notWishedList.length}`)
		console.log(infoElements)

		// await page.waitForTimeout(50000)

		// console.log("--DONE--")

		// // fs.writeFile("newData.txt", result, function (err) {
		// // 	if (err) {
		// // 		console.log(err);
		// // 	}
		// // });
		await page.waitForTimeout(200)
		return "DONE: " + url
	}
}

export function PrintTime(msg) {
	console.log(`              # ${msg} ${GetSeconds()}`)
}

export function GetSeconds() {
	const options = { minute: '2-digit', second: '2-digit' };
	// @ts-ignore
	return new Date().toLocaleTimeString("en-US", options);
}

// export function ScraperFilter(data, title) {
// 	let lowercaseTitle = title.toLowerCase()
// 	let shouldInclude = false

// 	data.keywords.forEach(wish => {
// 		wish = wish.toLowerCase()
// 		if (lowercaseTitle.includes(wish)) {
// 			shouldInclude = true
// 		}
// 	});
// 	data.blacklist.forEach(deny => {
// 		deny = deny.toLowerCase()
// 		if (deny && deny.length != 0 && lowercaseTitle.includes(deny)) {
// 			shouldInclude = false
// 		}
// 	});
// 	return shouldInclude
// }

export class InfoElement {
	constructor(title, link, price, wish, date) {
		this.title = title
		// this.link = link
		// this.price = price
		// this.wish = wish
		// this.date = date
	}

	toString() {
		// return this.title + "\n" + this.link + "\n" + this.price + "\n" + this.date + "\n" + this.wish + "\n"
	}
}

// export async function GetHandleProperty(element, property) {
// 	return await (await element.getProperty(property)).jsonValue();
// }






//#region Gather and print elements
// let list = await page.$$('.item-card-container');

// let htmlList = list.map(async element => {
// 	return await (await element.getProperty('outerHTML')).jsonValue()
// });

// let newList = []
// for (const element of htmlList) {
// 	let e = await element
// 	newList.push(e)
// }

// //convert to jsdom elements
// let jsdoms = []
// newList.forEach(element => {
// 	jsdoms.push(new JSDOM(element))
// });

// let wishButtons = []

// let infos = await jsdoms.map(element => {
// 	//get info
// 	let title = element.window.document.body.querySelector('a').title

// 	if (ScraperFilter(data, title)) {

// 	} else {
// 		return
// 	}

// 	let link = linkPrefix + element.window.document.body.querySelector('a').href
// 	let price = element.window.document.body.querySelector('.item-card-details-price').textContent
// 	let date = element.window.document.body.querySelector('.item-card-animate-time').textContent
// 	let wish = ""

// 	let contentButton = element.window.document.body.querySelector('.mb-1')
// 	let contentInnerHtml = contentButton.innerHTML
// 	if (contentInnerHtml.includes("Sparad i minneslistan")) {
// 		wish = "YES"
// 	} else if (contentInnerHtml.includes("Spara i minneslistan")) {
// 		wish = "NO"
// 		let buttonJSDOMElement = new JSDOM(contentInnerHtml)
// 		let button = buttonJSDOMElement.window.document.body.querySelector('[aria-label="Spara i minneslistan"]')

// 		wishButtons.push(button)
// 	}

// 	return new InfoElement(title, link, price, wish, date)
// });

// infos = infos.filter(x => x !== undefined);
// //#endregion

// console.log("--infos--")
// console.log(`Total: ${infos.length}`)

// console.log(infos)
// for (let i = 0; i < infos.length; i++) {
// 	result += infos[i]?.toString();
// }