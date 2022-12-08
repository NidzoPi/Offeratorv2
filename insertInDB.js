var insSheet = require('./addToSheet');
var dbIni = require('./dbInitialize.js');
var reporter = require('./reportWriterF');

function insertInDB(storeURLScrape, storeNameFinal, currDealSelector, codes, currentDate, dbInitialization){

    const db = dbIni.initializeDB();

      if(codes==''){

        console.log('Deal not found, check selector on: ' + storeNameFinal);
        reporter.writeReport(storeNameFinal, 'Deal not found, check selector on: ');

      }else{

        db.connect((err) => {

          if(err){
            throw err;
          }else{

          console.log('DB connected');
          let values = [];
          let sql = "INSERT INTO store (storeName, storeURL, dealSelector, deal, timeStam) VALUES ?";

          if(typeof currDealSelector=='object'){
            values =[
              [storeNameFinal, storeURLScrape, currDealSelector[0], codes, currentDate]    
            ];

          }else{

            values =[
              [storeNameFinal, storeURLScrape, currDealSelector, codes, currentDate]    
            ];

          }

          db.query(sql,[values],async function(err, result){

              if(err){

                throw err;

              }else{

                insSheet.addToSheet(values);
                
                console.log('Store ' + storeNameFinal + ' added in DB');
                
              }
          });
        }
        
      });    
      }  

}

module.exports.insertInDB = insertInDB;