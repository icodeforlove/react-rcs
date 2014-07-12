'use strict';

var XMLHttpFactories = [
    function () {return new window.XMLHttpRequest();},
    function () {return new window.ActiveXObject('Msxml2.XMLHTTP');},
    function () {return new window.ActiveXObject('Msxml3.XMLHTTP');},
    function () {return new window.ActiveXObject('Microsoft.XMLHTTP');}
];

function createXMLHTTPObject() {
    var xmlhttp = false;
    for (var i=0;i<XMLHttpFactories.length;i++) {
        try {
            xmlhttp = XMLHttpFactories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
}

function sendRequest(url,callback,postData) {
    var req = createXMLHTTPObject();
    if (!req) {
    	return;
    }
    var method = (postData) ? 'POST' : 'GET';
    req.open(method,url,true);
    if (postData) {
        req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    }
    req.onreadystatechange = function () {
        if (req.readyState !== 4) {
        	return;
        }
        if (req.status !== 200 && req.status !== 304) {
//          alert('HTTP error ' + req.status);
            return;
        }
        callback(req);
    };

    if (req.readyState === 4) {
    	return;
    }
    
    req.send(postData);
}

module.exports = sendRequest;