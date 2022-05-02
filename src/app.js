
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';

//Scraper

var scraperPage = new ScraperPage()
var page = await scraperPage.GeneratePage(false, true)

//TODO: add wishlist for each item in scraper

var scraper = new Scraper(page)
await scraper.Scrape()

await scraperPage.CloseBrowser()
