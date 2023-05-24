const scrape = require('./scraper');
var dbIni = require('./dbInitialize.js');

function checkSelectedBasePrimary(selectedStores){    
    const db = dbIni.initializeDB();
    db.connect((err) => {
        if(err){
        throw err;
        }else{
            console.log('DB connected');
            let primarySitesString = JSON.stringify(selectedStores);
            //console.log(primarySitesString.replaceAll(',',' or ').replaceAll('[','').replaceAll(']','').replaceAll(`"`,`'`));
            let sql = 'SELECT * FROM store WHERE storeName IN (' + primarySitesString.replaceAll('[','').replaceAll(']','').replaceAll(`"`,`'`) +') AND id IN (SELECT MAX(id) FROM store GROUP BY storeName);';
            //console.log(sql);
            //let sql = 'SELECT * FROM store WHERE id BETWEEN 1075 AND 1154;'
            db.query(sql,async function(err, rows){
                if(err){
                throw err;
                }else{
                    //console.log(rows.length);
                    var checkAllstoreURL = rows.map(x => x.storeURL);
                    var checkAllDealSelectorRow = rows.map(x => x.dealSelector);
                    var checkAllDealRow = rows.map(x => x.deal);
                    for(let i=0; i<rows.length; i++){
                        await scrape.scrapeProduct(checkAllstoreURL[i], checkAllDealSelectorRow[i], checkAllDealRow[i]);
                    }
                }
            });
        }
    });
}
module.exports.checkSelectedBasePrimary = checkSelectedBasePrimary;