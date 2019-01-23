let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);



chrome.storage.sync.get('pendoURL', function(data) {
  var urlList = data.pendoURL;
  document.getElementById('urlList').innerHTML = urlList;
});

chrome.storage.sync.get('pendoKey', function(data) {
  var apiKeyContent = data.pendoKey;
  document.getElementById('apiKeyContent').innerHTML = apiKeyContent;
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
  var text = document.getElementById("newURL").value;
  
  var cleanText = extractHostname(text);
  chrome.storage.sync.set({pendoURL: cleanText});
  // chrome.storage.sync.set({pendoKey: '9edd1221-0476-4b32-4684-ccb36fcfea72'});
  location.reload();
}


var input = document.getElementById("newURL");

input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("addURL").click();
  }
});



// api key configuration
document.getElementById("addKey").onclick = function() {
  var text = document.getElementById("newKey").value;
  chrome.storage.sync.set({pendoKey: text});
  location.reload();
}
