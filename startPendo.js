var includedDomains = [];
var pendoIsActive;

chrome.storage.sync.get(['pendoURL','pendoKey','visitorId','lightningSwitch'], function(data) {
    includedDomains = data.pendoURL;
    var thisFrameUrl = new URL(window.location.href);
    var keyValue = data.pendoKey;
    var visitorId = data.visitorId;
    var lightningOption = !!data.lightningSwitch;

    if (
        !pendoIsActive &&
        includedDomains.includes(thisFrameUrl.hostname)
    ) {
        var script = document.createElement("script");
        script.src = chrome.extension.getURL("script.js");

        script.onload = function () {
            this.remove();
            window.postMessage({ type: "pendoInjectorKey", keyValue: keyValue, idValue: visitorId, lightningValue: lightningOption }, "*");
        };

        (document.head || document.documentElement).appendChild(script);
        pendoIsActive = true;
    }
});

