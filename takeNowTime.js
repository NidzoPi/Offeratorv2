const { get } = require("express/lib/response");

function getNowTime(){
    
    let today = new Date();
    
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    let dateTime = date+' '+time;

    return dateTime;

}

module.exports.getNowTime = getNowTime;