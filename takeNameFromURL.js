const psl = require('psl');

const fs = require('fs');



function getName(url){

    function extractHostname(url) {
        var hostname;

        if(url.indexOf('myshopify')>-1){
          url = url.replace('myshopify','');
          url = url.replace('..','.');
        }

        if(url.indexOf('fastclass')>-1){

          url = url.replace('fastclass','');
          url = url.replace('..','.');

        }

        //protocol
      
        if (url.indexOf("//") > -1) {
          hostname = url.split('/')[2];
        } else {
          hostname = url.split('/')[0];
        }
      
        //port
        hostname = hostname.split(':')[0];
        //"?"
        hostname = hostname.split('?')[0];
      
        return hostname;

      }
      
      
      
      function extractRootDomain(url) {
          
        var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
      
        //extracting the root domain here
        //if there is a subdomain
        if (arrLen > 2) {

          domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
          //top level domain
          if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            
            domain = splitArr[arrLen - 3] + '.' + domain;

          }

        }
        return domain;
      }
      
      const urlHostname = url => {
        try {
          return new URL(url).hostname;
        }
        catch(e) { return e; }
      };

    let storeNameTemp = psl.get(extractHostname(url));

    function reverseString(str) {
        //return a new array
        var splitString = str.split(""); 
        
     
        //reverse array
        var reverseArray = splitString.reverse(); 
     
        //join array to string
        var joinArray = reverseArray.join(""); 
        
        return joinArray;

    }
     
    let storeNameTempReversed = reverseString(storeNameTemp);

    storeNameTempReversed = storeNameTempReversed.slice(storeNameTempReversed.indexOf('.')+1);

    let storeNameFinal = reverseString(storeNameTempReversed);

    return storeNameFinal;

}

module.exports.getName = getName;