const { init } = require('express/lib/application');
const { type } = require('express/lib/response');
const mySql = require('mysql');

function initializeDB(){

    const db = mySql.createConnection({
        host      : 'localhost',
        user      : 'root',
        password  : '',
        database  : 'scraperdb'
    });

    return db;

}

module.exports.initializeDB = initializeDB;
