//imports

const express = require('express');
const mySql = require('mysql');
const app = express();
const psl = require('psl');
const {google} = require('googleapis');



const port = 5000;
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

//var url = 'mongodb://localhost:5000/offeratordb';
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Static files

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

// sleep func

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// DB connection

function insertDB(storeURLScrape, storeNameFinal, currDealSelector, codes, currentDate){

  const db = mySql.createConnection({
    host      : 'localhost',
    user      : 'root',
    password  : '',
    database  : 'scraperdb'
  });

    db.connect((err) => {
      if(err){
        throw err;
      }else{
      console.log('DB connected');
      let sql = "INSERT INTO store (storeName, storeURL, dealSelector, deal, timeStam) VALUES ?";
      let values =[
         [storeNameFinal, storeURLScrape, currDealSelector, codes, currentDate]    
      ]
      db.query(sql,[values],async function(err, result){
          if(err){
            throw err;
          }else{
            const auth = new google.auth.GoogleAuth({
              keyFile : 'credentials.json',
              scopes  : 'https://www.googleapis.com/auth/spreadsheets',

            });

            // create client for auth

            const client = await auth.getClient();

            // sheets api action

            const googleSheets = google.sheets({version: 'v4', auth : client});


            const spreadsheetId = '1ohPZRbD_8hJ4V17isFAHhxz0QG-6S4_s_U84cMzRs_4';

            // get metadata about sheet

            const metaData = await googleSheets.spreadsheets.get({
               
              auth,
              
              spreadsheetId,

            });

            // write rows

            await googleSheets.spreadsheets.values.append({

              auth,

              spreadsheetId,

              range: 'Sheet1',

              valueInputOption: 'USER_ENTERED',

              resource : {
                values: values,
              }

            })
            
            console.log('Store added in DB');
          }
      });
    }
    
  });      
}

function checkGet(checkURL, helper){

  const db = mySql.createConnection({
    host      : 'localhost',
    user      : 'root',
    password  : '',
    database  : 'scraperdb'
  });

    db.connect((err) => {
      if(err){
        throw err;
      }else{
          
            // get name from URL

            function extractHostname(url) {
              var hostname;
              //protocol
            
              if (url.indexOf("//") > -1) {
                hostname = url.split('/')[2];
              } else {
                hostname = url.split('/')[0];
              }
            
              //port
              hostname = hostname.split(':')[0];
              //"?"
              hostname = hostname.split('?')[0];
            
              return hostname;
            }
            
            
            
            function extractRootDomain(url) {
              var domain = extractHostname(url),
              splitArr = domain.split('.'),
              arrLen = splitArr.length;
            
              //extracting the root domain here
              //if there is a subdomain
              if (arrLen > 2) {
                domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
                //top level domain
                if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
                  
                  domain = splitArr[arrLen - 3] + '.' + domain;
                }
              }
              return domain;
            }
            
            const urlHostname = url => {
              try {
                return new URL(url).hostname;
              }
              catch(e) { return e; }
            };
      
          let storeNameTemp = psl.get(extractHostname(checkURL));
      
          function reverseString(str) {
              //return a new array
              var splitString = str.split(""); 
              
           
              //reverse array
              var reverseArray = splitString.reverse(); 
           
              //join array to string
              var joinArray = reverseArray.join(""); 
              
              return joinArray;
          }
           
          let storeNameTempReversed = reverseString(storeNameTemp);
      
          storeNameTempReversed = storeNameTempReversed.slice(storeNameTempReversed.indexOf('.')+1);
      
          let storeNameFinal = reverseString(storeNameTempReversed);


          console.log('Store name: ' + storeNameFinal);

          console.log('DB connected');
          
          let sql = "SELECT id, storeName, storeURL, dealSelector, deal, timeStam FROM store WHERE storeName='" + storeNameFinal + "' ORDER BY id DESC LIMIT 1";
          db.query(sql,function(err, result){
              if(err){
                throw err;
              }
              if(result == ''){
                console.log('Store not found in DB');
              }
              else{
                var checkDealResult = result.map(a => a.deal);
                var checkDealSelector = result.map(x => x.dealSelector);
                console.log('Deal selector for checking store: ' + checkDealSelector);
                console.log('Deal for checking store: ' + checkDealResult);
                scrapeProduct(checkURL, checkDealSelector, checkDealResult);
              }
          });
          
      }
    
  }); 


}


// check all get sql

function checkAllGet(){

  const db = mySql.createConnection({
    host      : 'localhost',
    user      : 'root',
    password  : '',
    database  : 'scraperdb'
  });

  db.connect((err) => {
    if(err){
      throw err;
    }else{
    console.log('DB connected');
    let sql = 'SELECT * FROM store WHERE id IN (SELECT MAX(id) FROM store GROUP BY storeName);';
    db.query(sql,async function(err, rows){
        if(err){
          throw err;
        }else{
        
        var checkAllstoreURL = rows.map(x => x.storeURL);
        var checkAllDealSelectorRow = rows.map(x => x.dealSelector);
        var checkAllDealRow = rows.map(x => x.deal);

        for(let i=0; i<rows.length; i++){
          await scrapeProduct(checkAllstoreURL[i], checkAllDealSelectorRow[i], checkAllDealRow[i]);
        }
        
        }
    });
  }
  
});      
}





// Scraper part


async function scrapeProduct(currURL, currDealSelector, checkForm) {
    //var storeURLScrape = currURL;
    //var dealSelectorScrape = currDealSelector;
    
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const storeURLScrape = currURL;
    
    

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto(storeURLScrape);
    
    sleep(5000);

    function extractHostname(url) {
        var hostname;
        //protocol
      
        if (url.indexOf("//") > -1) {
          hostname = url.split('/')[2];
        } else {
          hostname = url.split('/')[0];
        }
      
        //port
        hostname = hostname.split(':')[0];
        //"?"
        hostname = hostname.split('?')[0];
      
        return hostname;
      }
      
      
      
      function extractRootDomain(url) {
        var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
      
        //extracting the root domain here
        //if there is a subdomain
        if (arrLen > 2) {
          domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
          //top level domain
          if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            
            domain = splitArr[arrLen - 3] + '.' + domain;
          }
        }
        return domain;
      }
      
      const urlHostname = url => {
        try {
          return new URL(url).hostname;
        }
        catch(e) { return e; }
      };

    let storeNameTemp = psl.get(extractHostname(storeURLScrape));

    function reverseString(str) {
        //return a new array
        var splitString = str.split(""); 
        
     
        //reverse array
        var reverseArray = splitString.reverse(); 
     
        //join array to string
        var joinArray = reverseArray.join(""); 
        
        return joinArray;
    }
     
    let storeNameTempReversed = reverseString(storeNameTemp);

    storeNameTempReversed = storeNameTempReversed.slice(storeNameTempReversed.indexOf('.')+1);

    let storeNameFinal = reverseString(storeNameTempReversed);

    console.log('STORE NAME: ' + storeNameFinal);

    await page.screenshot({path: 'test.png'});
    //console.log('prije funk: ' + dealSelectorScrape);
    const codes = await page.evaluate ((currDealSelector) => {
        //let useDeal = dealSelectorScrape;
        //console.log('poslije funk: ' + dealSelectorScrape);
        return Array.from(document.querySelectorAll(currDealSelector)).map((x) => x.innerText);
    },currDealSelector);

    //console.log('TEST:' + checkForm + ' ' + codes[0]);

    // insert in db and date_time
    
    if(checkForm != codes[0]){ 
      
    let today = new Date();

    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let dateTime = date+' '+time;

    
      
     
        insertDB(storeURLScrape, storeNameFinal, currDealSelector, codes[0], dateTime);
    }
      
      
    

    

    

    await browser.close();
}



// POST/GET methods

app.get('', (req,res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/postInsertData', (req,res) => {
    var storeURL = (req.body.storeURL);
    var dealSelector = (req.body.dealSelector);
    console.log('Store url: ' + storeURL);
    console.log('Deal selector: ' + dealSelector);
    scrapeProduct(storeURL, dealSelector, '');
    res.end('URL: ' + storeURL + ' Deal selector: ' + dealSelector);
});

app.post('/postCheckData', (req,res) =>{
    var checkURL = (req.body.exStoreURL);
    console.log('Existing store URL: ' + checkURL);
    checkGet(checkURL, '');
    res.end('Existing store URL: ' + checkURL);
});

app.post('/checkAllData', (req,res) =>{
    checkAllGet();
    res.end('Checking all stores: ');
});





// Listen to port 5000
app.listen(port, () => console.log(`Listening on port ${port}`));

