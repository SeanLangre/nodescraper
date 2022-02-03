import got from 'got';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';

const url = 'https://www.tradera.com/';

async function firstTry() {
	const response = await got(url);
	const dom = new JSDOM(response.body);
	console.log(dom);
}

// await firstTry()

async function headlessBrowser(){
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
  
	await page.goto(url);
  
	const links = await page.$$eval('a', elements => elements.filter(element => {
	  const parensRegex = /^((?!\().)*$/;
	  return parensRegex.test(element.textContent);
	}).map(element => element.href));
  
	links.forEach(link => console.log(link));
  
	await browser.close();
}

await headlessBrowser();