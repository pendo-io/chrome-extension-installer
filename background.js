chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
});

chrome.runtime.onInstalled.addListener(function() {

  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {

    chrome.declarativeContent.onPageChanged.addRules([{

      conditions: 

        [
          new chrome.declarativeContent.PageStateMatcher({})
        ],

      actions: 

        [
          new chrome.declarativeContent.ShowPageAction()
        ]

    }]);

  });

});


function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}





function pendoMessage() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {content: "Initialize Pendo"});
  });

}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        var url = tab.url.split('#')[0]; // Exclude URL fragments

        newURL = extractHostname(url)

        chrome.storage.sync.get('pendoURL', function(data) {
          var urlList = data.pendoURL;
          

          if (urlList.includes(newURL)) {
            pendoMessage();
          }

        });


    }
});

