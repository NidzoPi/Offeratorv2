var insSheet = require('./addToSheet');
var insCortSheet = require('./addToCortneySheet');
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
                var primarySitesCortney = [
                  'guns',
                  'withclarity',
                  'medterracbd',
                  'naadam',
                  'sundaysfordogs',
                  'carawayhome',
                  'thewebster',
                  'cutterbuck',
                  'surlatable',
                  'picturesongold',
                  'gundrymd', 'magnoliabakery',
                  'personalcreations',
                  'thecbdistillery',
                  'frootbat',
                  'storz-bickel',
                  'paulaschoice',
                  'supercuts',
                  'theayurvedaexperience',
                  'aimeekestenberg',
                  'jasemedical',
                  'onnit',
                  'everyplate',
                  'quicksilverscientific',
                  'marshalls',
                  'legendarywhitetails',
                  'solawave',
                  'kingschools',
                  'tripmasters',
                  'safelite',
                  'shopmaximumfitness',
                  'nasm',
                  'bloomchic',
                  'canadapharmacy',
                  'safcodental',
                  'albanypark'
                ]
                if(primarySitesCortney.includes(storeNameFinal)){
                  insCortSheet.addToSheet(values);
                } else {
                  insSheet.addToSheet(values);
                }
                
                console.log('Store ' + storeNameFinal + ' added in DB');
                
              }
          });
        }
      });    
      }  

}

module.exports.insertInDB = insertInDB;