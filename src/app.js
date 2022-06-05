
import ScraperPage from './ScraperPage.js';
import Scraper from './Scraper.js';
import ScraperLogin from './ScraperLogin.js';
import datas from './data-test.json';
import bluebird from 'bluebird';


//-- Setup browser --
var scraperPage = new ScraperPage()
const browser = await scraperPage.GetBrowser(false, false)
// const browser = await scraperPage.GetBrowser(true, false)
// page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

// -- LOGIN --
// var page = await browser.newPage()
// await page.setDefaultNavigationTimeout(0);
// var slogin = new ScraperLogin(page)
// await slogin.Login()

// -- Scraper --
async function runScraper(data, browser) {
    var page = await browser.newPage()
    await page.setDefaultTimeout(120000)
    await page.setDefaultNavigationTimeout(120000);
    try {
        var scraper = new Scraper()
        return await scraper.Scrape(data, page)
    } catch (error) {
        console.log(error)
        return await page.close()
    } finally {
        console.log("--page finally--")
        return await page.close()
    }
}

//https://advancedweb.hu/how-to-speed-up-puppeteer-scraping-with-parallelization/
async function runScraperAsync(browser) {
    // return await bluebird.map(datas.list, async (data) => {
    //     let result = await runScraper(data, browser)
    //     console.log("--runScraper result--")
    //     return result
    // }, { concurrency: 1 }).catch(function (err) {
    //     console.log(err)
    // })
    // -- Promise.all --
    // return Promise.all(datas.list.map(async (data) => {
    //     let result = await runScraper(data, browser)
    //     console.log("--runScraper result--")
    //     return result
    // })).catch(function (err) {
    //     console.log(err)
    // })
    // -- Syncronous --
    for await (const data of datas.list) {
        let result = await runScraper(data, browser)
        console.log("--runScraper result--")
        return result
    }

}

await runScraperAsync(browser)

// try {
//     const result = runScraperAsync(browser)
//     console.log("--DONE--" + result)
//     await Promise.resolve(result)
// } catch (error) {
//     console.log(error)
//     await browser.close()
// } finally {
//     console.log("--browser finally--")
//     await browser.close()
// }

// -- new code --

// const withBrowser = async (fn) => {
//     try {
//         return await fn(browser);
//     } finally {
//         await browser.close();
//     }
// }

// const withPage = (browser) => async (fn) => {
//     const page = await browser.newPage();
//     try {
//         return await fn(page);
//     } finally {
//         await page.close();
//     }
// }

// const results = await withBrowser(async (browser) => {
//     return Promise.all(datas.list.map(async (data) => {
//         return withPage(browser)(async (page) => {
//             await page.setDefaultTimeout(120000)
//             await page.setDefaultNavigationTimeout(120000);
//             try {
//                 var scraper = new Scraper()
//                 return await scraper.Scrape(data, page)
//             } catch (error) {
//                 console.log(error)
//                 return await page.close()
//             } finally {
//                 console.log("--page finally--")
//                 return await page.close()
//             }
//         })
//     }))
// }).catch(function (err) {
//     console.log("---- ERROR ----")
//     console.log(err)
// })