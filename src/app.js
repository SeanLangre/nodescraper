
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';
import datas from './data/data-test.json' assert {type: 'json'};

// -- LOGIN --
async function login() {
    var scraperPage = new ScraperPage()
    var page = await scraperPage.GeneratePage(true, false)
    try {
        var slogin = new ScraperLogin(page)
        await slogin.Login()
    } catch (error) {

    } finally {
        // await page.close();
        await scraperPage.CloseBrowser()
    }
}

//Scraper
async function runScraper(inputData, inputPage) {
    var scraper = new Scraper()
    await scraper.Scrape(inputData, inputPage)
}

async function StartScraper() {
    Scraper.PrintScrapeStart();
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    var scraperPage = new ScraperPage()
    var inputPage = await scraperPage.GeneratePage(true, false)
    for (const data of datas.list) {
        let result = await runScraper(data, inputPage);
    }
    await scraperPage.CloseBrowser()

    console.log("--DONE--")
    return true
}


await login()
await StartScraper()



