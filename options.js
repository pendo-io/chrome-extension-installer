chrome.storage.sync.get('pendoURL', function(data) {
  var urlList = data.pendoURL;
  document.getElementById('urlList').innerHTML = "Current URL: " + urlList;
});

chrome.storage.sync.get('pendoKey', function(data) {
  var apiKeyContent = data.pendoKey;
  document.getElementById('apiKeyContent').innerHTML = "Current Pendo API Key: " + apiKeyContent;
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

// url configuration
document.getElementById("addURL").onclick = function() {
  var rawURL = document.getElementById("newURL").value;  
  var cleanURL = extractHostname(rawURL);
  chrome.storage.sync.set({pendoURL: cleanURL});
  location.reload();
}


// api key configuration
document.getElementById("addKey").onclick = function() {
  var newAPIKey = document.getElementById("newKey").value;
  chrome.storage.sync.set({pendoKey: newAPIKey});
  location.reload();
}




// enter to submit
var input = document.getElementById("newURL");

input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("addURL").click();
  }
});

var input = document.getElementById("newKey");

input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("addKey").click();
  }
});


