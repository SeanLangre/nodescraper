
import ScraperLogin from './ScraperLogin.js';
import ScraperPage from './ScraperPage.js';

var scraperPage = new ScraperPage()
var page = await scraperPage.GeneratePage(false)

var loginScraper = new ScraperLogin(page)
await loginScraper.Login()

await scraperPage.CloseBrowser()
