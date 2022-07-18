
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';
import datas from './data/data-test.json' assert {type: 'json'};
import ScraperBrowser from './ScraperBrowser.js';

// -- Browser --
// var scrapeBrowser = new ScraperBrowser();
// var browser = await scrapeBrowser.GenerateBrowser(true, false);

// -- LOGIN --
async function login(browser) {
    var scraperPage = new ScraperPage()
    var page = await scraperPage.GeneratePage(browser)
    try {
        var slogin = new ScraperLogin(page)
        await slogin.Login()
    } catch (error) {

    } finally {
        // await page.close();
        // await scraperPage.CloseBrowser()
    }
}

// //Scraper
// async function runScraper(inputData, inputPage) {
//     var scraper = new Scraper()
//     await scraper.Scrape(inputData, inputPage)
// }

// async function StartScraper() {
//     Scraper.PrintScrapeStart();
//     // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

//     var scraperPage = new ScraperPage()
//     var inputPage = await scraperPage.GeneratePage(browser)
//     for (const data of datas.list) {
//         let result = await runScraper(data, inputPage);
//     }
//     // await scraperPage.CloseBrowser()

//     console.log("--DONE--")
//     return true
// }


// await login()
// await StartScraper()
// await scrapeBrowser.CloseBrowser();

const withBrowser = async (fn) => {
    var scrapeBrowser = new ScraperBrowser();

    const browser = await scrapeBrowser.GenerateBrowser(true, false);
    await login(browser)
    await Scraper.PrintScrapeStart();

    try {
        return await fn(browser);
    } finally {
        await browser.close();
    }
}

const withPage = (browser) => async (fn) => {
    const page = await browser.newPage();
    try {
        return await fn(page);
    } finally {
        await page.close();
    }
}

const results = [];

await withBrowser(async (browser) => {
    for (const data of datas.list) {
        const result = await withPage(browser)(async (page) => {
            var scraper = new Scraper()
            let result = await scraper.Scrape(data, page)
            return result
        });

        results.push(result);
    }
});