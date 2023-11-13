const scrapeIt = require('./scraper.js');
const getN = require('./takeNameFromURL');
var dbIni = require('./dbInitialize.js');


function checkInDB(checkURL){

    const db = dbIni.initializeDB();

    db.connect((err) => {
        if(err){
        throw err;
        }else{
            
            // get name from URL

            storeNameFinal = getN.getName(checkURL);
        
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
                scrapeIt.scrapeProduct(checkURL, checkDealSelector, checkDealResult);

                }
            });
            
        }
    
    }); 

}

module.exports.checkInDB = checkInDB;