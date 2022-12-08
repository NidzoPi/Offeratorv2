const fs = require('fs');


async function writeReport(storeNameFinal, msg){

    await fs.appendFileSync("report.txt", msg + storeNameFinal + '\r\n', "UTF-8",{'flags': 'a+'});
    
}

module.exports.writeReport = writeReport;