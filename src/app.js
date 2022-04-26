
import ScraperLogin from './ScraperLogin.js';
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperUtils from './ScraperUtils.js';

//Scraper

var scraperPage = new ScraperPage()
var page = await scraperPage.GeneratePage()

// var loginScraper = new ScraperLogin(page)
// await loginScraper.Login()

//TODO: make sure session is kept between login and scaper
//TODO: check wishlist for each item in scraper
//TODO: add wishlist for each item in scraper

var scraper = new Scraper(page)
await scraper.Scrape()

// page.close()
