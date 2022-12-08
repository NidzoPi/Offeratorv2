const insertCall = require('./insertInDB');
const time = require('./takeNowTime');
const reportWriter = require('./reportWriterF');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
//const sleeping = require('./sleepF');
const getN = require('./takeNameFromURL');



var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


async function scrapeProduct(currURL, currDealSelector, checkForm) {
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const storeURLScrape = currURL;
    
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    try{
        await page.goto(storeURLScrape);
    }
    catch(err){
        
        console.log("Can't reach site: " + storeURLScrape);

        reportWriter.writeReport(storeURLScrape, "Can't reach site: ");
    }
    
    //sleeping.sleep(6000);

    var storeNameFinal = getN.getName(currURL);

    console.log('Scraping: ' + storeNameFinal);
    try{
    await page.screenshot({path: 'test.png'});
    }catch(err){
        console.log('Can not take a screenshot');
    }
    
    try {
        await page.waitForSelector(currDealSelector, {timeout: 15000});
      } catch (err) {
          console.log('Waiting for selector time exceded!');
      }
    
    try{

    var codes = await page.evaluate ((currDealSelector) => {
        
        return Array.from(document.querySelectorAll(currDealSelector)).map((x) => x.innerText);
          
    },currDealSelector);
    
    }catch(err){

        reportWriter.writeReport(storeNameFinal, 'Navigation problem on: ');

        console.log('Navigation problem on: ' + storeNameFinal);

    }

    //console.log(codes[0]);
    try{
    if(typeof codes[0]==='undefined'){

        codes[0] = '';

        var dateTime = time.getNowTime();

        insertCall.insertInDB(storeURLScrape, storeNameFinal, currDealSelector, codes[0], dateTime);

    }else{
          
          codes[0] = codes[0].replace(/(\r\n|\n|\r)/gm, '');

          if(checkForm != codes[0]){ 
              
                var dateTime = time.getNowTime();

                insertCall.insertInDB(storeURLScrape, storeNameFinal, currDealSelector, codes[0], dateTime);

          }
      }
    }catch(err){
        console.log('Cannot read properties of undefined on: ' + storeNameFinal);
    }

    await browser.close();
    console.log('Scrape ended!');

}

module.exports.scrapeProduct = scrapeProduct;