
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';
import ScraperBrowser from './ScraperBrowser.js';
import ScraperUtils from './ScraperUtils.js';
import ScraperTimer from './ScraperTimer.js';
import * as fs from 'fs';
import bluebird from 'bluebird';

//read JSON
var dataList = ""
fs.readFile(process.env.DATA_PATH, (err, data) => {
    if (err){
        console.log("readFile ERROR");
        console.log(err);
        throw err
    }

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
        console.log("login ERROR");
        console.log(error);
        throw error
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
    Scraper.PrintScrapeStart();
    timer.StartTimer();

    try {
        return await fn(browser);
    } catch (error) {
        console.log("withBrowser ERROR");
        console.log(error);
        throw error
    } finally {
        console.log("BROWSER browser.close();");
        try {
            await browser.close();
        } catch (error) {
            console.log("browser.close() ERROR");
            console.log(error);
            throw error
        } finally {
            
        }
    }
}

const withPage = (browser) => async (fn) => {
    const page = await browser.newPage()//.catch(err => { console.log(err); throw err; });
    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    try {
        return await fn(page);
    } catch (error) {
        console.log("withPage ERROR");
        console.log(error);
        throw error
    } finally {
        await page.close();
    }
}

var counter = 0;
// var results = []

await withBrowser((browser) => {
    let bbResult = bluebird.map(dataList, (data) => {
        // try {
        let pagePromise = withPage(browser)(async (page) => {
            var scraper = new Scraper()
            let scraperPromise = new Promise(function (resolve, reject) {
                resolve(scraper.ScrapeWrapper(data, page, counter++))
            });
            // console.log(`ScrapeWrapper done id (${result?.id})`);

            return await Promise.resolve(scraperPromise).then(data => {
                // console.log("First handler", data);
                if (data?.result?.length > 0) {
                    console.log("First handler", data.result);
                }
                return data;
            })
        })
        return Promise.resolve(pagePromise)
    }, { concurrency: 3 }).then((result) => {
        console.log("bluebird.map then !!");
        return result
    }).catch((e) => {
        console.log("bluebird.map ERROR");
        console.log(e);
        throw e;
    }).finally(() => {
        console.log("bluebird.map FINALLY");
    })
    return bbResult;
}).then((result) => {
    console.log("withBrowser then !!");
    console.log(result.map((e) => {
        if (e.result.length > 0) {
            return e.result
        }
    }));
}).catch((e) => {
    console.log("withBrowser ERROR");
    console.log(e);
    throw e;
}).finally(() => {
    console.log("withBrowser FINALLY");
    timer.EndTimer();
    console.log("-DONE-");
})
