var isCSPDisabled = false;
var pendoStatus = true;

chrome.runtime.onInstalled.addListener(function() {

  chrome.tabs.create({
    url: 'chrome-extension://' + chrome.runtime.id + '/options.html',
    active: true
  });

  return false;

});


function extractHostname(pageURL) {
    var hostname;

    //find & remove protocol (http, ftp, etc.) and get hostname
    if (pageURL.indexOf("//") > -1) {
        hostname = pageURL.split('/')[2];
    }
    else {
        hostname = pageURL.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};


function pendoMessage() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {content: "Initialize Pendo"});
  });

};

var onHeadersReceived = function(details) {
  if (!isCSPDisabled) {
      return;
  }

  for (var i = 0; i < details.responseHeaders.length; i++) {
    if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase()) {

      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders
  };
};



var updateUI = function() {
  var iconName = pendoStatus ? 'on' : 'off';
  var title    = pendoStatus ? 'running on this page' : 'not running on this page';

  chrome.browserAction.setIcon({ path: "images/icon38-" + iconName + ".png" });
  chrome.browserAction.setTitle({ title: 'Pendo is ' + title });
};


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    var filterDomain;
    var url = tab.url.split('#')[0]; // Exclude URL fragments
    var newURL = location.port;

    if (!url.includes("local")) {
      newURL = extractHostname(url);
    }

    chrome.storage.sync.get(['pendoURL','pendoSwitch'], function(data) {
      var urlList = data.pendoURL;
      pendoStatus = data.pendoSwitch;

      filterDomain = data.pendoURL;   

    if (filterDomain) {     
      chrome.storage.sync.get('cspSwitch', function(data) {  
        isCSPDisabled = data.cspSwitch;
        var filterURL = filterDomain;

        if (!filterURL.includes("local")) {
          filterURL = "*://" + filterDomain + "/*";
        }

        var filter = {
          urls: [filterURL],
          types: ["main_frame", "sub_frame"]
        };

        chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, filter, ["blocking", "responseHeaders"]);     
        
      });
    }     

      if (pendoStatus===true && typeof urlList !== 'undefined' && urlList.includes(newURL)) {
        pendoMessage();
      }

      else {
        updateUI();
      }                    
    });
    
          
    
  };
});


chrome.browserAction.onClicked.addListener(function() {
  
  chrome.tabs.create({
    url: 'chrome-extension://' + chrome.runtime.id + '/options.html',
    active: true
  });
  
});




