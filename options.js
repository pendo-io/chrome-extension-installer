var pendoStatus = true;

// display the current URL
chrome.storage.sync.get('pendoURL', function(data) {

  if (data.pendoURL) {
    var urlList = data.pendoURL;
    // var a = document.createElement('a');

    // a.href = 'http://' + urlList;    
    // a.target = '_blank';

    document.getElementById("newURL").value = urlList;
    
    var btn = document.createElement("a");    
    var t = document.createTextNode("Go to your app");
    btn.appendChild(t); 
    btn.className = "btn btn-square btn-lg btn-filled-green";
    btn.setAttribute('target', '_blank');

    if (urlList.includes("localhost")) {
      btn.setAttribute('href', urlList);
    }

    else {
      btn.setAttribute('href', 'https://' + urlList);
    }

    document.getElementById('app-launch-container').appendChild(btn);

  }

});

// display the current API key
chrome.storage.sync.get('pendoKey', function(data) {
  if (data.pendoKey) {
    var apiKeyContent = data.pendoKey;

    document.getElementById("newKey").value = apiKeyContent;
  }
});


chrome.storage.sync.get('pendoSwitch', function(data) {
  if(!data.pendoSwitch){
    document.getElementById('PendoStatus').innerHTML = "This Pendo extension is currently off";
    return;
  }

  document.getElementById('PendoStatus').innerHTML = "This Pendo extension is currently on";
  
});


chrome.storage.sync.get('cspSwitch', function(data) {
  var cspStatus = data.cspSwitch;

  if (cspStatus===true) {
    var string1 = "CSP headers are currently disabled for "; 

    chrome.storage.sync.get('pendoURL', function(data) {
      var string2 = data.pendoURL;

      document.getElementById('CSPStatus').innerHTML = string1+string2;
    });    
  }  

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

  if (rawURL.includes("localhost")) {
    chrome.storage.sync.set({pendoURL: rawURL});
  }

  else {
    var cleanURL = extractHostname(rawURL);
    chrome.storage.sync.set({pendoURL: cleanURL});
  }

  location.reload();
}

// api key configuration
document.getElementById("addKey").onclick = function() {
  var newAPIKey = document.getElementById("newKey").value;

  chrome.storage.sync.set({pendoKey: newAPIKey});
  location.reload();
}


// CSP configuration
// chrome.storage.sync.set({cspSwitch: true});
chrome.storage.sync.get('cspSwitch', function(data) {
  var cspStatus = data.cspSwitch;

  document.getElementById("checkbox").onclick = function() {
    chrome.storage.sync.set({cspSwitch: !cspStatus});

    if (!cspStatus) {
      chrome.browsingData.remove({}, {"serviceWorkers": true}, function () {});
      location.reload();
    }

    location.reload();

  }

  if (cspStatus===true) {
    document.getElementById("checkbox").checked = true;  
  }

});


//Turn Pendo extension on/off
chrome.storage.sync.get('pendoSwitch', function(data) {
  pendoStatus = data.pendoSwitch;

  document.getElementById("checkbox2").onclick = function() {
    chrome.storage.sync.set({pendoSwitch: !pendoStatus});
    location.reload();
  }

  if (pendoStatus===true) {
    document.getElementById("checkbox2").checked = true;  
  }

});



// enter to submit
var input = document.getElementById("newURL");
var input2 = document.getElementById("newKey");

input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("addURL").click();
  }
});

input2.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("addKey").click();
  }
});


