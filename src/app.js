
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';

// -- LOGIN --
// var scraperPage = new ScraperPage()
// var page = await scraperPage.GeneratePage(false, false)
// var slogin = new ScraperLogin(page)
// await slogin.Login()

//Scraper

var scraperPage = new ScraperPage()
var page = await scraperPage.GeneratePage(false, false)

var scraper = new Scraper(page)
await scraper.Scrape()

await scraperPage.CloseBrowser()

//2nd time

var page = await scraperPage.GeneratePage(false, false)

var scraper = new Scraper(page)
await scraper.Scrape()

await scraperPage.CloseBrowser()
