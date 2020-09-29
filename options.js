var pendoStatus = true;
// display the current URL
chrome.storage.sync.get("pendoURL", function (data) {
    if (data.pendoURL) {
        var urlList = data.pendoURL;
        var firstURL = urlList[0];
        // var a = document.createElement('a');
        // a.href = 'http://' + urlList;
        // a.target = '_blank';
        document.getElementById("newURL").value = urlList;
        var btn = document.createElement("a");
        var t = document.createTextNode("Go to your app");
        btn.appendChild(t);
        btn.className = "btn btn-square btn-lg btn-filled-green";
        btn.setAttribute("target", "_blank");
        if (firstURL.includes("localhost")) {
            btn.setAttribute("href", firstURL);
        } else {
            btn.setAttribute("href", "https://" + firstURL);
        }
        document.getElementById("app-launch-container").appendChild(btn);
    }
});
// display the current API key
chrome.storage.sync.get("pendoKey", function (data) {
    if (data.pendoKey) {
        var apiKeyContent = data.pendoKey;
        document.getElementById("newKey").value = apiKeyContent;
    }
});
// display the current value for visitorID
chrome.storage.sync.get('visitorId', function(data) {
  if (data.visitorId) {
    var visitorValue = data.visitorId;
    document.getElementById("visitor").value = visitorValue;
  }
});

// display the current vlaue for accountID
chrome.storage.sync.get('accountId', function(data) {
  if (data.accountId) {
    var accountValue = data.accountId;
    document.getElementById("account").value = accountValue;
  }
});

chrome.storage.sync.get(["pendoSwitch", "lightningSwitch"], function (data) {
    if (!data.pendoSwitch) {
        document.getElementById("PendoStatus").innerHTML =
            "This Pendo extension is currently off";
        return;
    }
    if (data.pendoSwitch && data.lightningSwitch) {
        document.getElementById("PendoStatus").innerHTML =
            "This Pendo extension is currently on Salesforce Lightning Mode";
        return;
    }
    document.getElementById("PendoStatus").innerHTML =
        "This Pendo extension is currently on";
});

chrome.storage.sync.get("cspSwitch", function (data) {
    var cspStatus = data.cspSwitch;
    if (cspStatus === true) {
        var string1 = "CSP headers are currently disabled for ";
        chrome.storage.sync.get("pendoURL", function (data) {
            var string2 = data.pendoURL;
            document.getElementById("CSPStatus").innerHTML = string1 + string2;
        });
    }
});

function extractHostname(pageURL) {
    var hostname;

    //find & remove protocol (http, ftp, etc.) and get hostname
    if (pageURL.indexOf("//") > -1) {
        hostname = pageURL.split("/")[2];
    } else {
        hostname = pageURL.split("/")[0];
    }

    //find & remove port number
    hostname = hostname.split(":")[0];
    //find & remove "?"
    hostname = hostname.split("?")[0];

    return hostname;
}

// url configuration
document.getElementById("addURL").onclick = function () {
    var urlValue = document.getElementById("newURL").value;
    var urlList = urlValue.split(",").map((v) => v.trim());
    var urlsOut = [];
    urlList.forEach((rawURL) => {
        if (rawURL.includes("localhost")) {
            urlsOut.push(rawURL);
        } else {
            urlsOut.push(extractHostname(rawURL));
        }
    });
    chrome.storage.sync.set({ pendoURL: urlsOut });
    location.reload();
};
// api key configuration
document.getElementById("addKey").onclick = function () {
    var newAPIKey = document.getElementById("newKey").value;
    chrome.storage.sync.set({ pendoKey: newAPIKey });
    location.reload();
};
// visitor ID configuration
document.getElementById("addVisitor").onclick = function() {
  var newVisitorId = document.getElementById("visitor").value;
  if (newVisitorId == ''){
    newVisitorId = 'test-visitor';
  }
  chrome.storage.sync.set({visitorId: newVisitorId});
  location.reload();
}
// account ID configuration
document.getElementById("addAccount").onclick = function() {
  var newAccountId = document.getElementById("account").value;
  if (newAccountId == ''){
    newAccountId = 'test-account';
  }
  chrome.storage.sync.set({accountId: newAccountId});
  location.reload();
}
// CSP configuration
// chrome.storage.sync.set({cspSwitch: true});
chrome.storage.sync.get("cspSwitch", function (data) {
    var cspStatus = data.cspSwitch;
    document.getElementById("checkbox").onclick = function () {
        chrome.storage.sync.set({ cspSwitch: !cspStatus });
        location.reload();
    };
    if (cspStatus === true) {
        document.getElementById("checkbox").checked = true;
    }
});
//Turn Pendo extension on/off
chrome.storage.sync.get("pendoSwitch", function (data) {
    pendoStatus = data.pendoSwitch;
    document.getElementById("checkbox2").onclick = function () {
        chrome.storage.sync.set({ pendoSwitch: !pendoStatus });
        location.reload();
    };
    if (pendoStatus === true) {
        document.getElementById("checkbox2").checked = true;
    }
});

//Turn Lightning option extension on/off
chrome.storage.sync.get("lightningSwitch", function (data) {
    lightningStatus = data.lightningSwitch;
    document.getElementById("checkbox3").onclick = function () {
        chrome.storage.sync.set({ lightningSwitch: !lightningStatus });
        location.reload();
    };
    if (lightningStatus === true) {
        document.getElementById("checkbox3").checked = true;
    }
});

// enter to submit
var input = document.getElementById("newURL");
var input2 = document.getElementById("newKey");
var input3 = document.getElementById("visitor");
var input4 = document.getElementById("account");

input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("addURL").click();
  }
});
input2.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("addKey").click();
    }
});
input3.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("addVisitor").click();
    }
});
input4.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("addAccount").click();
  }
});
