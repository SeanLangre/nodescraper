
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';
import datas from './data.json';
import bluebird from 'bluebird';


//-- Setup browser --
var scraperPage = new ScraperPage()
const browser = await scraperPage.GetBrowser(true, false)
// page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

// -- LOGIN --
// var page = await browser.newPage()
// await page.setDefaultNavigationTimeout(0);
// var slogin = new ScraperLogin(page)
// await slogin.Login()

// -- Scraper --
async function runScraper(data, browser) {
    var page = await browser.newPage()
    await page.setDefaultTimeout(120000)
    await page.setDefaultNavigationTimeout(120000);
    try {
        var scraper = new Scraper()
        return await scraper.Scrape(data, page)
    } catch (error) {
        console.log(error)
        return await page.close()
    } finally {
        console.log("--page finally--")
        return await page.close()
    }
}

//https://advancedweb.hu/how-to-speed-up-puppeteer-scraping-with-parallelization/
async function runScraperAsync(browser) {
    return bluebird.map(datas.list, async (data) => {
        let result = await runScraper(data, browser)
        console.log("--runScraper result--")
        return result
    }, { concurrency: 1 }).catch(function (err) {
        console.log(err)
    })
}

try {
    const result = await runScraperAsync(browser)
    console.log("--DONE--" + result)
    await Promise.resolve(result)
} catch (error) {
    console.log(error)
    await browser.close()
} finally {
    console.log("--browser finally--")
    await browser.close()
}

