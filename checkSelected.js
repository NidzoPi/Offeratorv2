const scrape = require('./scraper');
var dbIni = require('./dbInitialize.js');

function checkSelectedBase(selectedStores){    

    const db = dbIni.initializeDB();

    db.connect((err) => {
        if(err){
        throw err;
        }else{
            console.log('DB connected');
            if(typeof selectedStores === 'string'){
                console.log('Select multiple stores or use check single store option!');
            }
            for(var k=0; k<selectedStores.length; k++){
            let sql = "SELECT * FROM store WHERE storeName='" + selectedStores[k] + "' AND id IN (SELECT MAX(id) FROM store GROUP BY storeName);";
            db.query(sql,async function(err, rows){
                if(err){
                throw err;
                }else{
                
                    var checkAllstoreURL = rows.map(x => x.storeURL);
                    var checkAllDealSelectorRow = rows.map(x => x.dealSelector);
                    var checkAllDealRow = rows.map(x => x.deal);

                    for(let i=0; i<rows.length; i++){

                        await scrape.scrapeProduct(checkAllstoreURL[i], checkAllDealSelectorRow[i], checkAllDealRow[i]);
                        
                    }
                }
            });
            }
        }
    });

}

module.exports.checkSelectedBase = checkSelectedBase;