
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';

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

async function runScraper() {
    var scraperPage = new ScraperPage()
    // var page = await scraperPage.GeneratePage(false, false)
    var page = await scraperPage.GeneratePage(true, false)

    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    var scraper = new Scraper(page)
    await scraper.Scrape()

    await scraperPage.CloseBrowser()
}

await login()
await runScraper()

//2nd time

// var page = await scraperPage.GeneratePage(false, false)

// var scraper = new Scraper(page)
// await scraper.Scrape()

// await scraperPage.CloseBrowser()
