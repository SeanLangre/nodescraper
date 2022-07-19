
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';
import ScraperBrowser from './ScraperBrowser.js';
import rxjs, { catchError, finalize, identity, mergeMap, of, takeUntil, timeout, toArray } from 'rxjs';
import ScraperUtils from './ScraperUtils.js';
import ScraperTimer from './ScraperTimer.js';
import * as fs from 'fs';

// import datas from './data/data-test.json' assert {type: 'json'};

//read JSON
var dataList = ""
await fs.readFile(process.env.DATA_PATH, (err, data) => {
    if (err) throw err;
  
    dataList = JSON.parse(data).list;
})

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
        // await page.waitForTimeout(50)
        await page.waitForSelector('.startpage-hero__content');
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
    const page = await browser.newPage()//.catch(err => { console.log(err); throw err; });
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    try {
        return await fn(page);
    } catch (error) {
        console.log("ERROR");
        console.log(error);
        throw error
    } finally {
        // console.log("PAGE page.close();");
        // await page.waitForTimeout(10)
        await page.close();
    }
}

var counter = 0;
var results = []
try {
    results = await withBrowser(async (browser) => {
        let observable = await rxjs.from(dataList).pipe(
            await mergeMap(async (data) => {
                try {
                    let pagePromise = await withPage(browser)(async (page) => {
                        var scraper = new Scraper()
                        let result = await scraper.ScrapeWrapper(data, page, counter++)
                        console.log(`ScrapeWrapper done id (${result?.id})`);
                        return await result
                    })
                    let result = await pagePromise;
                    console.log(`pagePromise done`);
                    return await result
                } catch (error) {
                    console.log("ERROR");
                    console.log(error);
                    throw error
                } finally {
                    console.log("mergmap finally");
                }
            }, 4),
            toArray(),
            timeout(5 * 60 * 1000),
            catchError(error => of(`Request timed out`)),
            // takeUntil(() => { return counter > dataList.length }),
            finalize(() => console.log('Sequence complete')) // Execute when the observable completes
        )

        // let firstRxjsVal
        // let sub = await observable.subscribe(async () => {
        //     if(counter >= dataList.length){
        //         sub.unsubscribe()
        //         firstRxjsVal = await rxjs.firstValueFrom(observable, { defaultValue: "" });
        //     }
        // })
        // return await firstRxjsVal;

        console.log("pipe done");
        let firstRxjsVal = await rxjs.firstValueFrom(observable, { defaultValue: "" });
        console.log("firstRxjsVal done");
        return await firstRxjsVal;

        //return await rxjs.lastValueFrom(promise);
        // return await rxjs.firstValueFrom(promise, { defaultValue: 0 });
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
    console.log(results);
}