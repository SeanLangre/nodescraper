
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';
import ScraperBrowser from './ScraperBrowser.js';
import rxjs, { mergeMap, toArray } from 'rxjs';
import ScraperUtils from './ScraperUtils.js';
import datas from './data/data.json' assert {type: 'json'};
import ScraperTimer from './ScraperTimer.js';

//time
let timer = new ScraperTimer();

// -- LOGIN --
async function login(browser) {
    var scraperPage = new ScraperPage()
    var page = await scraperPage.GeneratePage(browser)
    try {
        var slogin = new ScraperLogin(page)
        return await slogin.Login()
    } catch (error) {

    } finally {
        await ScraperUtils.setCookiesInBrowser(page)

        await page.waitForTimeout(50)
        await page.close()
    }
}

const withBrowser = async (fn) => {
    var scrapeBrowser = new ScraperBrowser();

    const browser = await scrapeBrowser.GenerateBrowser(true, false);
    await login(browser)
    await Scraper.PrintScrapeStart();
    timer.StartTimer();

    try {
        return await fn(browser);
    } finally {
        console.log("BROWSER browser.close();");
        await browser.close();
    }
}

const withPage = (browser) => async (fn) => {
    const page = await browser.newPage().catch(err => { console.log(err); throw err; });
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    try {
        return await fn(page);
    } finally {
        // console.log("PAGE page.close();");
        await page.waitForTimeout(50)
        await page.close();
    }
}

var counter = 0;
var results = []
try {
    results = await withBrowser(async (browser) => {
        let promise = rxjs.from(datas.list).pipe(
            mergeMap(async (data) => {

                try {
                    return await withPage(browser)(async (page) => {
                        counter = counter + 1
                        var scraper = new Scraper()
                        let result = await scraper.ScrapeWrapper(data, page, counter)
                        return result
                    })
                } catch (error) {
                    console.log("ERROR");
                    console.log(error);
                    throw error
                }

            }, 3),
            toArray(),
        )

        //return await rxjs.lastValueFrom(promise);
        return await rxjs.firstValueFrom(promise, { defaultValue: 0 });
        // ).toPromise();
    })
        .catch((e) => {
            console.log("ERROR");
            console.log(e);
            throw e;
        });
} catch (error) {
    console.log("ERROR");
    console.log(error);
    console.log(results);
    throw error
} finally {
    timer.EndTimer();
    console.log("-DONE-");
}