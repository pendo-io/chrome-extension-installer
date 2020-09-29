var pendoStatus = {};

var includedDomains = [];
var cspFilter = [];

chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({
        url: "chrome-extension://" + chrome.runtime.id + "/options.html",
        active: true,
    });

    return false;
});

function convertToCspFilter() {
    includedDomains = includedDomains || [];
    return includedDomains.map((domain) => {
        return `*://${domain}/*`;
    });
}

var onHeadersReceived = function (details) {
    for (var i = 0; i < details.responseHeaders.length; i++) {
        if (
            "content-security-policy" ===
            details.responseHeaders[i].name.toLowerCase()
        ) {
            for (var j = 0; j < requiredHeaders.length; j++) {
                details.responseHeaders[i].value = injectIntoCSP(
                    details.responseHeaders[i].value,
                    requiredHeaders[j].dir,
                    requiredHeaders[j].src
                );
            }
        }
    }

    return {
        responseHeaders: details.responseHeaders,
    };
};

function updateIncludedDomains() {
    chrome.storage.sync.get(["pendoURL", "cspSwitch"], function (data) {
        includedDomains = data.pendoURL;
        var cspInjectionActive = data.cspSwitch;
        var cspFilter = convertToCspFilter();
        if (!!cspInjectionActive && cspFilter.length > 0) {
            chrome.webRequest.onHeadersReceived.addListener(
                onHeadersReceived,
                { urls: cspFilter },
                ["blocking", "responseHeaders"]
            );
        } else {
            chrome.webRequest.onHeadersReceived.removeListener(
                onHeadersReceived,
                { urls: cspFilter },
                ["blocking", "responseHeaders"]
            );
        }
    });
}
updateIncludedDomains();

chrome.storage.onChanged.addListener(function (newData) {
    if (
        typeof newData.pendoURL !== "undefined" ||
        typeof newData.cspSwitch !== "undefined"
    ) {
        updateIncludedDomains();
    }
});

var subId = "5635956879917056";
var requiredHeaders = [
    { dir: "script-src", src: "'unsafe-inline'" },
    { dir: "script-src", src: "'unsafe-eval'" },
    { dir: "script-src", src: "'self'" },
    { dir: "script-src", src: "app.pendo.io" },
    { dir: "script-src", src: "pendo-io-static.storage.googleapis.com" },
    { dir: "script-src", src: "cdn.pendo.io" },
    { dir: "script-src", src: `*.storage.googleapis.com` },
    { dir: "script-src", src: "data.pendo.io" },
    { dir: "style-src", src: "'unsafe-inline'" },
    { dir: "style-src", src: "'self'" },
    { dir: "style-src", src: "app.pendo.io" },
    { dir: "style-src", src: "cdn.pendo.io" },
    { dir: "style-src", src: `*.storage.googleapis.com` },
    { dir: "img-src", src: "'self'" },
    { dir: "img-src", src: "cdn.pendo.io" },
    { dir: "img-src", src: "app.pendo.io" },
    { dir: "img-src", src: `*.storage.googleapis.com` },
    { dir: "connect-src", src: "'self'" },
    { dir: "connect-src", src: "app.pendo.io" },
    { dir: "connect-src", src: `*.storage.googleapis.com` },
    { dir: "connect-src", src: "data.pendo.io" },
    { dir: "frame-src", src: "'self'" },
    { dir: "frame-src", src: "app.pendo.io" },
    { dir: "child-src", src: "'self'" },
    { dir: "child-src", src: "app.pendo.io" },
];

function extractHostname(pageURL) {
    //pageURL should be string
    pageURL = new URL(pageURL);
    return pageURL.hostname;
}

function startPendo(tab) {
    chrome.tabs.executeScript(
        (tabId = tab.id),
        (details = {
            file: "./startPendo.js",
            allFrames: true,
        })
    );
}

var injectIntoCSP = function (cspHeader, directive, expression) {
    var dirLoc = cspHeader.indexOf(directive);
    if (dirLoc === -1) {
        /*
        Don't add new directives if they didn't already exist
        cspHeader += `${directive} ${expression};`;
        */
    } else {
        dirLoc += directive.length;
        cspHeader = `${cspHeader.slice(
            0,
            dirLoc
        )} ${expression}${cspHeader.slice(dirLoc)}`;
    }
    return cspHeader;
};

var updateUI = function (tabId) {
    var iconName = pendoStatus[tabId] ? "on" : "off";
    var title = pendoStatus[tabId]
        ? "running on this page"
        : "not running on this page";

    chrome.browserAction.setIcon({
        path: "images/icon38-" + iconName + ".png",
    });
    chrome.browserAction.setTitle({ title: "Pendo is " + title });
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        var newDomain = extractHostname(tab.url);
        includedDomains = includedDomains || [];
        chrome.storage.sync.get(["pendoSwitch"], function (data) {
            var pendoSwitch = data.pendoSwitch;
            if (!!pendoSwitch && includedDomains.includes(newDomain)) {
                pendoStatus[tabId] = true;
                startPendo(tab);
            } else {
                pendoStatus[tabId] = false;
            }
            updateUI(tabId);
        });
    }
});

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({
        url: "chrome-extension://" + chrome.runtime.id + "/options.html",
        active: true,
    });
});

chrome.tabs.onActivated.addListener(function (tab) {
    updateUI(tab.tabId);
});
