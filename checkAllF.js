const scrape = require('./scraper');
var dbIni = require('./dbInitialize.js');

function checkAllBase(){    

    const db = dbIni.initializeDB();

    db.connect((err) => {
        if(err){
        throw err;
        }else{
            console.log('DB connected');
            let sql = 'SELECT * FROM store WHERE id IN (SELECT MAX(id) FROM store GROUP BY storeName);';
            //let sql = 'SELECT * FROM store WHERE id BETWEEN 1075 AND 1154;'
            db.query(sql,async function(err, rows){
                if(err){
                throw err;
                }else{
                    var dontCheckCortney = [
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
                    var checkAllStoreName = rows.map(x => x.storeName);
                    var checkAllstoreURL = rows.map(x => x.storeURL);
                    var checkAllDealSelectorRow = rows.map(x => x.dealSelector);
                    var checkAllDealRow = rows.map(x => x.deal);

                    for(let i=0; i<rows.length; i++){
                        if(!dontCheckCortney.includes(checkAllStoreName[i])){
                            await scrape.scrapeProduct(checkAllstoreURL[i], checkAllDealSelectorRow[i], checkAllDealRow[i]);
                        }
                    }
                
                }
            });
        }
    });

}

module.exports.checkAllBase = checkAllBase;