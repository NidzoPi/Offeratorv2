// imports

const express = require('express');
const app = express();
const fs = require('fs');
var router = express.Router();

// importing function files

var checkDB = require('./checkDBJS')
var checkALLDB = require('./checkAllF');
var scrapeIt = require('./scraper');
var selCheck = require('./checkSelected');
var database = require('./dbInitialize.js');
// PORT define



const port = 5000;

// Static files

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

app.set('view engine', 'ejs');



// POST/GET methods

app.get('', (req, res) => {
    var db = database.initializeDB();
    db.query('SELECT storeName FROM store WHERE id IN (SELECT MAX(id) FROM store GROUP BY storeName) ORDER BY storeName ASC', function (error, data) {

        res.render('index', { store_data: data });

    });
});

module.exports = router;


app.post('/postInsertData', (req, res) => {
    var storeURL = (req.body.storeURL);
    var dealSelector = (req.body.dealSelector);
    scrapeIt.scrapeProduct(storeURL, dealSelector, '');
    res.end('URL: ' + storeURL + ' Deal selector: ' + dealSelector);
});

app.post('/postCheckData', (req, res) => {
    var checkURL = (req.body.exStoreURL);
    checkDB.checkInDB(checkURL);
    res.end('Existing store URL: ' + checkURL);
});

app.post('/checkAllData', (req, res) => {
    checkALLDB.checkAllBase();
    res.end('Checking all stores...');
});
app.post('/checkSelected', (req, res) => {
    var selectedTrue = (req.body.listed);
    console.log(selectedTrue);
    selCheck.checkSelectedBase(selectedTrue);
    res.end('Checking selected store...')
});
app.post('/checkPrimary', (req, res) => {
    var primarySites = [
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
    databasePrimary.checkSelectedBasePrimary(primarySites);
    res.end('Checking selected store...');
});

// Listen to port 5000

app.listen(port, () => console.log(`Listening on port ${port}`));

