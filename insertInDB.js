var insSheet = require('./addToSheet');
var insCortSheet = require('./addToCortneySheet');
var dbIni = require('./dbInitialize.js');
var reporter = require('./reportWriterF');

function insertInDB(storeURLScrape, storeNameFinal, currDealSelector, codes, currentDate, csmName) {

  const db = dbIni.initializeDB();

  if (codes == '') {

    console.log('Deal not found, check selector on: ' + storeNameFinal);
    reporter.writeReport(storeNameFinal, 'Deal not found, check selector on: ');

  } else {

    db.connect((err) => {

      if (err) {
        throw err;
      } else {

        console.log('DB connected');
        let values = [];
        let sql = "INSERT INTO store (storeName, storeURL, dealSelector, deal, timeStam, CSM) VALUES ?";

        if (typeof currDealSelector == 'object') {
          values = [
            [storeNameFinal, storeURLScrape, currDealSelector[0], codes, currentDate, csmName]
          ];

        } else {

          values = [
            [storeNameFinal, storeURLScrape, currDealSelector, codes, currentDate, csmName]
          ];

        }

        db.query(sql, [values], async function (err, result) {

          if (err) {

            throw err;

          } else {
            var primarySitesCortney = [
              'Thefarmersdog',
              'fast-growing-trees',
              'venus',
              'bbqguys',
              'nutrisystem',
              'saatva',
              'chewy',
              'ariat',
              'rebag',
              'invictastores',
              'lovehoney',
              'greenworkstools',
              'aroma360',
              'bluenile',
              'tjx',
              'globalgolf',
              'agjeans',
              'bouqs',
              'corkcicle',
              'storesupply',
              'aliengearholsters',
              'journeecollection',
              'becker',
              'ashleyblackguru',
              'grabagun',
              'safelite',
              'vicicollection',
              'store.trimhealthymama',
              'hvacdirect',
              'hotelcollection',
              'lexingtonlaw',
              'golfballs',
              'keyzarjewelry',
              'ticketsmarter',
              '3balls',
              'belletire',
              'scheels',
              'budgetblinds',
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
              'gundrymd',
              'magnoliabakery',
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
            if (primarySitesCortney.includes(storeNameFinal)) {
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