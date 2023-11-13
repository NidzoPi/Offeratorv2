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
                    var checkAllstoreURL = rows.map(x => x.storeURL);
                    var checkAllDealSelectorRow = rows.map(x => x.dealSelector);
                    var checkAllDealRow = rows.map(x => x.deal);
                    var checkAllCSM = rows.map(x => x.CSM);
                    //console.log(checkAllCSM);
                    for(let i=0; i<rows.length; i++){
                        console.log('Checking ' + parseInt(i+1) + ' out of ' + rows.length);
                        await scrape.scrapeProduct(checkAllstoreURL[i], checkAllDealSelectorRow[i], checkAllDealRow[i], checkAllCSM[i]);   
                    }
                }
            });
        }
    });

}

module.exports.checkAllBase = checkAllBase;